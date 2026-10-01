import { Flashcard, QuizQuestion } from '@/types';

type MaterialText = { title: string; content: string };

const getQuestionAnswers = (content: string) => content
  .split(/\r?\n/)
  .map((line) => line.match(/^\s*(?:[-*]\s*)?(.+?\?)\s+(.+?)\s*$/))
  .filter((match): match is RegExpMatchArray => Boolean(match))
  .map((match) => ({ question: match[1].trim(), answer: match[2].trim() }));

const getStudyFacts = ({ title, content }: MaterialText) => {
  const facts = content
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((fact) => fact.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim())
    .filter((fact) => fact.length >= 20 && !fact.endsWith(':'));

  return facts.length ? facts : [content || title || 'No study content provided'];
};

export const createFallbackFlashcards = (material: MaterialText): Flashcard[] => {
  const questionAnswers = getQuestionAnswers(material.content);
  if (questionAnswers.length) return questionAnswers.slice(0, 5);

  return getStudyFacts(material).slice(0, 5).map((fact) => ({
    question: `What key point does the material make about: ${fact.slice(0, 100)}?`,
    answer: fact,
  }));
};

export const createFallbackQuiz = (material: MaterialText): QuizQuestion[] => {
  const questionAnswers = getQuestionAnswers(material.content);
  if (questionAnswers.length) {
    return questionAnswers.slice(0, 5).map((item, index) => {
      const options: string[] = [];
      for (let offset = 0; offset < questionAnswers.length && options.length < 4; offset += 1) {
        const option = questionAnswers[(index + offset) % questionAnswers.length].answer;
        if (!options.includes(option)) options.push(option);
      }
      ['Not stated in the material', 'Cannot be determined from the material', 'None of the above']
        .forEach((option) => {
          if (options.length < 4 && !options.includes(option)) options.push(option);
        });

      return { question: item.question, options, answer: item.answer };
    });
  }

  return getStudyFacts(material).slice(0, 5).map((fact) => ({
    question: `According to the material, is this statement correct?\n\n${fact}`,
    options: ['True', 'False', 'Not stated', 'Cannot be determined'],
    answer: 'True',
  }));
};