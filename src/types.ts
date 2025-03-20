export type UiState = 'initial' | 'loading' | 'error' | 'data' | 'empty';

/**
 * Represents a category in the database.
 * Matches the `Categories` model in the Prisma schema.
 */
export type Category = {
  id: number; 
  title: string; 
  slug: string; 
  questions?: Question[]; 
};

/**
 * Represents a question in the database.
 * Matches the `Question` model in the Prisma schema.
 */
export type Question = {
  id: number; 
  text: string;
  categoryId: number;
  options: Option[]; 
};

/**
 * Represents an answer option for a question.
 * Matches the `Option` model in the Prisma schema.
 */
export type Option = {
  id: number; 
  text: string;
  isCorrect: boolean;
  questionId: number; 
};

/**
 * Represents a paginated response.
 */
export type Paginated<T> = {
  data: T[]; 
  pagination: {
    page: number;
    limit: number; 
    total: number; 
    totalPages: number; 
  };
};