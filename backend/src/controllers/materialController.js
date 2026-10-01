const fs = require("fs");
const Material = require("../models/Material");
const { askGemini } = require("../utils/gemini");

// Helper: read uploaded file text safely
const readFileText = async (filePath, mimetype) => {
  try {
    if (filePath.endsWith(".pdf")) {
      try {
        const pdfParse = require("pdf-parse");
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text || fs.readFileSync(filePath, "utf-8");
      } catch (e) {
        return fs.readFileSync(filePath, "utf-8");
      }
    }
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    return "Study material content placeholder";
  }
};

const safeJsonArrayParse = (rawText, fallback = []) => {
  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    const arrayMatch = clean.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    return JSON.parse(clean);
  } catch (e) {
    console.warn("JSON parsing fallback used for Gemini response:", e.message);
    return fallback;
  }
};

const getStudyQuestionAnswers = (content) => content
  .split(/\r?\n/)
  .map((line) => line.match(/^\s*(?:[-*]\s*)?(.+?\?)\s+(.+?)\s*$/))
  .filter(Boolean)
  .map((match) => ({ question: match[1].trim(), answer: match[2].trim() }));

const getStudyFacts = (content, title) => {
  const facts = content
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((fact) => fact.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
    .filter((fact) => fact.length >= 20 && !fact.endsWith(":"));

  return facts.length ? facts : [String(content || title || "No study content provided").trim().slice(0, 500)];
};

const buildFallbackFlashcards = (material, count) => {
  const questionAnswers = getStudyQuestionAnswers(material.content);
  if (questionAnswers.length) return questionAnswers.slice(0, count);

  return getStudyFacts(material.content, material.title).slice(0, count).map((fact) => ({
    question: `What key point does the material make about: ${fact.slice(0, 100)}?`,
    answer: fact,
  }));
};

const buildFallbackQuiz = (material, count) => {
  const questionAnswers = getStudyQuestionAnswers(material.content);
  if (questionAnswers.length) {
    return questionAnswers.slice(0, count).map((item, index) => {
      const options = [];
      for (let offset = 0; offset < questionAnswers.length && options.length < 4; offset += 1) {
        const option = questionAnswers[(index + offset) % questionAnswers.length].answer;
        if (!options.includes(option)) options.push(option);
      }
      ["Not stated in the material", "Cannot be determined from the material", "None of the above"]
        .forEach((option) => {
          if (options.length < 4 && !options.includes(option)) options.push(option);
        });

      return { question: item.question, options, answer: item.answer };
    });
  }

  return getStudyFacts(material.content, material.title).slice(0, count).map((fact) => ({
    question: `According to the material, is this statement correct?\n\n${fact}`,
    options: ["True", "False", "Not stated", "Cannot be determined"],
    answer: "True",
  }));
};

const getAccessibleMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    res.status(404).json({ message: "Not found" });
    return null;
  }

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    res.status(403).json({ message: "Access denied" });
    return null;
  }

  return material;
};

// POST /api/materials/upload
const uploadMaterial = async (req, res) => {
  if (!req.file && !req.body.content) {
    return res.status(400).json({ message: "No file or text content provided" });
  }

  const title = req.body.title || (req.file ? req.file.originalname : "Uploaded Material");
  let content = req.body.content || "";

  if (req.file) {
    content = await readFileText(req.file.path, req.file.mimetype);
    try {
      fs.unlinkSync(req.file.path);
    } catch {}
  }

  const material = await Material.create({
    user: req.user.userId,
    title,
    content,
    filename: req.file ? req.file.originalname : "direct_input.txt",
  });

  res.status(201).json({ message: "Material uploaded", material });
};

// GET /api/materials
const getMaterials = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user.userId };
  const materials = await Material.find(filter).select("-content -flashcards -quiz -studyPlan").sort("-createdAt");
  res.json(materials);
};

// GET /api/materials/:id
const getMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(material);
};

// DELETE /api/materials/:id
const deleteMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  await material.deleteOne();
  res.json({ message: "Deleted" });
};

// POST /api/materials/:id/summarize
const summarize = async (req, res) => {
  const material = await getAccessibleMaterial(req, res);
  if (!material) return;

  const prompt = `Summarize the following study material clearly and concisely in bullet points for quick student revision:\n\n${material.content}`;
  const summary = await askGemini(prompt);

  material.summary = summary;
  await material.save();

  res.json({ summary });
};

// POST /api/materials/:id/flashcards
const generateFlashcards = async (req, res) => {
  const material = await getAccessibleMaterial(req, res);
  if (!material) return;

  const count = req.body.count || 5;

  const prompt = `
Create ${count} high-yield active recall flashcards from the study material below.
Return ONLY a valid JSON array in this exact format, no extra markdown or text:
[{"question": "...", "answer": "..."}]

Study material:
${material.content}
`;

  let flashcards;
  let source = "gemini";
  try {
    const raw = await askGemini(prompt);
    flashcards = safeJsonArrayParse(raw);
    if (!Array.isArray(flashcards) || flashcards.length === 0) throw new Error("Gemini returned no flashcards");
  } catch (err) {
    console.warn("Using material-based flashcards after Gemini failure:", err.message);
    flashcards = buildFallbackFlashcards(material, count);
    source = "material-fallback";
  }

  material.flashcards = flashcards;
  await material.save();

  res.json({ flashcards, source });
};

// POST /api/materials/:id/quiz
const generateQuiz = async (req, res) => {
  const material = await getAccessibleMaterial(req, res);
  if (!material) return;

  const count = req.body.count || 5;

  const prompt = `
Create ${count} multiple choice quiz questions with 4 options and the correct answer string from the study material below.
Return ONLY a valid JSON array in this exact format, no extra markdown or text:
[{"question": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A"}]

Study material:
${material.content}
`;

  let quiz;
  let source = "gemini";
  try {
    const raw = await askGemini(prompt);
    quiz = safeJsonArrayParse(raw);
    if (!Array.isArray(quiz) || quiz.length === 0) throw new Error("Gemini returned no quiz questions");
  } catch (err) {
    console.warn("Using material-based quiz after Gemini failure:", err.message);
    quiz = buildFallbackQuiz(material, count);
    source = "material-fallback";
  }

  material.quiz = quiz;
  await material.save();

  res.json({ quiz, source });
};

// POST /api/materials/:id/study-plan
const generateStudyPlan = async (req, res) => {
  const material = await getAccessibleMaterial(req, res);
  if (!material) return;

  const { goal, hoursPerDay, days } = req.body;

  const prompt = `
You are an expert academic study planner. Based on the study material below, create a personalized ${days || 7}-day study plan.
Student Goal: ${goal || "Understand and master key concepts for exams"}
Daily Study Time: ${hoursPerDay || 2} hours per day.

Return a clear day-by-day revision schedule with actionable topics and active recall tasks.

Study material:
${material.content}
`;

  const studyPlan = await askGemini(prompt);

  material.studyPlan = studyPlan;
  await material.save();

  res.json({ studyPlan });
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  summarize,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
};
