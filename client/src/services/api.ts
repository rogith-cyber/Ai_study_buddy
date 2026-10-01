import { StudyMaterial, Flashcard, QuizQuestion, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: User['role'];
  createdAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMaterials: number;
}

class ApiService {
  private refreshPromise: Promise<string | null> | null = null;

  private getToken(): string | null {
    return localStorage.getItem('studybuddy_token');
  }

  private getHeaders(isFormData = false, token = this.getToken()): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private expireSession() {
    localStorage.removeItem('studybuddy_token');
    localStorage.removeItem('studybuddy_refresh_token');
    localStorage.removeItem('studybuddy_user');
    window.dispatchEvent(new Event('studybuddy:session-expired'));
  }

  private refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    const refreshToken = localStorage.getItem('studybuddy_refresh_token');
    if (!refreshToken) {
      this.expireSession();
      return Promise.resolve(null);
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'x-refresh-token': refreshToken },
        });
        if (!response.ok) throw new Error('Session expired');

        const tokens = await response.json() as { accessToken: string; refreshToken: string };
        localStorage.setItem('studybuddy_token', tokens.accessToken);
        localStorage.setItem('studybuddy_refresh_token', tokens.refreshToken);
        return tokens.accessToken;
      } catch {
        this.expireSession();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, isFormData = false): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const sendRequest = (token = this.getToken()) => fetch(url, {
        ...options,
        headers: { ...this.getHeaders(isFormData, token), ...options.headers },
      });

      let res = await sendRequest();
      if (res.status === 401 && !endpoint.startsWith('/auth/')) {
        const refreshedToken = await this.refreshAccessToken();
        if (refreshedToken) res = await sendRequest(refreshedToken);
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed. Please try again.');
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[Backend API Connection Info] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    return this.request<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', { method: 'POST' });
  }

  // Study Materials Endpoints
  async getMaterials(): Promise<StudyMaterial[]> {
    return this.request<StudyMaterial[]>('/materials');
  }

  async getMaterial(id: string): Promise<StudyMaterial> {
    return this.request<StudyMaterial>(`/materials/${id}`);
  }

  async uploadMaterial(file: File, title?: string): Promise<{ message: string; material: StudyMaterial }> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return this.request<{ message: string; material: StudyMaterial }>('/materials/upload', {
      method: 'POST',
      body: formData,
    }, true);
  }

  async deleteMaterial(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/materials/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Feature Endpoints
  async summarize(materialId: string): Promise<{ summary: string }> {
    return this.request<{ summary: string }>(`/materials/${materialId}/summarize`, {
      method: 'POST',
    });
  }

  async generateFlashcards(materialId: string, count = 5): Promise<{ flashcards: Flashcard[]; source?: 'gemini' | 'material-fallback' }> {
    return this.request<{ flashcards: Flashcard[]; source?: 'gemini' | 'material-fallback' }>(`/materials/${materialId}/flashcards`, {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async generateQuiz(materialId: string, count = 5): Promise<{ quiz: QuizQuestion[]; source?: 'gemini' | 'material-fallback' }> {
    return this.request<{ quiz: QuizQuestion[]; source?: 'gemini' | 'material-fallback' }>(`/materials/${materialId}/quiz`, {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async generateStudyPlan(materialId: string, options: { goal?: string; hoursPerDay?: number; days?: number }): Promise<{ studyPlan: string }> {
    return this.request<{ studyPlan: string }>(`/materials/${materialId}/study-plan`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/admin/users');
  }

  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async deleteAdminUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiService();

