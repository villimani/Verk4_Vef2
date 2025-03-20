'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionsApi } from '@/api';
import { Category } from '@/types';
import styles from './NewQuestion.module.css'; // Import the CSS module

export default function NewQuestionPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category | null>(null); 


  useEffect(() => {
    async function fetchCategory() {
      const api = new QuestionsApi();
      const category = await api.getCategory(slug); 
      if (category) {
        setCategory(category);
      } else {
        setError('Category not found.');
      }
    }

    fetchCategory();
  }, [slug]);

  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = text;
    setOptions(updatedOptions);
  };


  const handleMarkCorrect = (index: number) => {
    const updatedOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!category) {
      setError('Category not found.');
      return;
    }
  
    if (!questionText.trim()) {
      setError('Please enter the question text.');
      return;
    }
  
    if (options.some((opt) => !opt.text.trim())) {
      setError('Please fill out all 4 options.');
      return;
    }
  
    if (!options.some((opt) => opt.isCorrect)) {
      setError('Please mark one option as correct.');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
  
    try {
      const api = new QuestionsApi();
      const newQuestion = {
        text: questionText,
        categoryId: category.id, 
        options: options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      };
  
      const createdQuestion = await api.createQuestion(slug, newQuestion);
  
      if (createdQuestion) {
        alert('Question created successfully!');
        router.push(`/flokkar/${slug}`); 
      } else {
        setError('Failed to create question. Please try again.');
      }
    } catch (err) {
      console.error('Error creating question:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a New Question</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="questionText">Question Text</label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Answer Options (Exactly 4)</label>
          <div className={styles.options}>
            {options.map((opt, index) => (
              <div key={index} className={styles.option}>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleMarkCorrect(index)}
                  className={styles.correctButton}
                >
                  {opt.isCorrect ? '✅ Correct' : 'Mark as Correct'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Submitting...' : 'Create Question'}
        </button>
      </form>
    </div>
  );
}