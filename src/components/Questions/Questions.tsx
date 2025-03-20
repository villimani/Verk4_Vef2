'use client';

import { QuestionsApi } from '@/api';
import { Question, Paginated, UiState } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Questions.module.css'; 

type Props = {
  slug: string; 
};

export default function Questions({ slug }: Props) {
  const router = useRouter();
  const [uiState, setUiState] = useState<UiState>('initial');
  const [questions, setQuestions] = useState<Paginated<Question> | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [questionId: number]: number }>({}); 
  const [feedback, setFeedback] = useState<{ [questionId: number]: boolean | null }>({}); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 


  useEffect(() => {
    async function fetchQuestions() {
      setUiState('loading');

      const api = new QuestionsApi();
      const questionsResponse = await api.getQuestions(slug, currentPage, itemsPerPage); 

      if (!questionsResponse) {
        setUiState('error');
      } else {
        console.log('Fetched Questions:', questionsResponse); 


        const questionsWithIds = questionsResponse.data.map((question) => ({
          ...question,
          options: question.options?.map((opt, index) => ({
            ...opt,
            id: opt.id || index + 1,
          })),
        }));

        setUiState(questionsWithIds.length === 0 ? 'empty' : 'data');
        setQuestions({ ...questionsResponse, data: questionsWithIds });
      }
    }

    fetchQuestions();
  }, [slug, currentPage]);

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId, 
    }));
  };

  const handleCheckAnswer = (questionId: number) => {
    const selectedOptionId = selectedOptions[questionId];
    if (selectedOptionId === undefined) {
      alert('Please select an option before checking the answer.');
      return;
    }

    const question = questions?.data.find((q) => q.id === questionId);
    if (!question || !question.options) {
      return;
    }

    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) {
      return;
    }

    const isCorrect = selectedOption.isCorrect;
    setFeedback((prev) => ({
      ...prev,
      [questionId]: isCorrect, 
    }));
  };

  const navigateToCreateQuestion = () => {
    router.push(`/flokkar/${slug}/new-question`);
  };

  const handleNextPage = () => {
    if (questions && currentPage < questions.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (uiState === 'loading') {
    return <p>Loading questions...</p>;
  }

  if (uiState === 'error') {
    return <p>Failed to fetch questions. Please try again later.</p>;
  }

  if (uiState === 'empty') {
    return (
      <div>
        <p>No questions found for this category.</p>
        <button onClick={navigateToCreateQuestion} className={styles.createButton}>
          Create New Question
        </button>
      </div>
    );
  }


  return (
    <div className={styles.questions}>
      {/* Button to navigate to the "Create Question" page */}
      <button onClick={navigateToCreateQuestion} className={styles.createButton}>
        Create New Question
      </button>

      <ul>
        {questions?.data.map((question) => (
          <li key={question.id} className={styles.questionItem}>
            <h3 className={styles.questionTitle}>{question.text}</h3> {/* Apply the questionTitle style */}
            {question.options && question.options.length > 0 && (
              <ul className={styles.optionsList}>
                {question.options.map((option) => (
                  <li key={option.id} className={styles.optionItem}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        onChange={() => handleOptionSelect(question.id, option.id)}
                        checked={selectedOptions[question.id] === option.id}
                      />
                      <span>{option.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {feedback[question.id] !== undefined && (
              <p className={feedback[question.id] ? styles.correctFeedback : styles.incorrectFeedback}>
                {feedback[question.id] ? 'Correct!' : 'Incorrect!'}
              </p>
            )}
            <button
              onClick={() => handleCheckAnswer(question.id)}
              className={styles.checkButton}
            >
              Check Answer
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {questions?.pagination.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === questions?.pagination.totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}