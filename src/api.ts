import { Category, Paginated, Question } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-vef-4.onrender.com';

export class QuestionsApi {
  async fetchFromApi<T>(url: string, options?: RequestInit): Promise<T | null> {
    let response: Response | undefined;
    try {
      console.log(`Fetching data from: ${url}`);
      response = await fetch(url, options);
    } catch {
      console.error('Error fetching from API:', url);
      return null;
    }

    if (!response.ok) {
      console.error(`Non-2xx status from API: ${response.status}`, url);
      return null;
    }

    let json: unknown;
    try {
      json = await response.json();
      console.log('API Response:', json);
    } catch {
      console.error('Error parsing JSON:', url);
      return null;
    }

    return json as T;
  }

  async getCategory(slug: string): Promise<Category | null> {
    const url = BASE_URL + `/categories/${slug}`;
    console.log(`Fetching category with slug: ${slug}`);

    const response = await this.fetchFromApi<Category | null>(url);

    if (!response) {
      console.error(`Failed to fetch category with slug: ${slug}`);
    }

    return response;
  }

  async getCategories(page: number = 1, limit: number = 10): Promise<Paginated<Category> | null> {
    const url = `${BASE_URL}/categories?page=${page}&limit=${limit}`;
    console.log('Fetching categories from:', url);
    return this.fetchFromApi<Paginated<Category>>(url);
  }

  async getQuestions(slug: string, page: number = 1, limit: number = 10): Promise<Paginated<Question> | null> {
    const url = `${BASE_URL}/categories/${slug}/questions?page=${page}&limit=${limit}`;
    console.log('Fetching questions from:', url);
    return this.fetchFromApi<Paginated<Question>>(url);
  }

  async deleteCategory(slug: string): Promise<boolean> {
    const url = `${BASE_URL}/categories/${slug}`;
    const response = await this.fetchFromApi<{ success: boolean }>(url, {
      method: 'DELETE',
    });

    return response?.success || false;
  }

  async createCategory(category: { title: string }): Promise<Category | null> {
    const url = `${BASE_URL}/categories`;
    const response = await this.fetchFromApi<Category>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    return response;
  }

  async createQuestion(slug: string, question: {
    text: string;
    categoryId: number;
    options: Array<{ text: string; isCorrect: boolean }>;
  }): Promise<Question | null> {
    try {
      console.log('Sending question data:', JSON.stringify(question, null, 2));

      const url = `${BASE_URL}/categories/${slug}/questions`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      if (!response.ok) {
        let errorResponse;
        try {
          errorResponse = JSON.parse(responseText);
        } catch {
          errorResponse = responseText;
        }
        console.error('Server error:', errorResponse);
        throw new Error('Failed to create question');
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error creating question:', error);
      return null;
    }
  }
}