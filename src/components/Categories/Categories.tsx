'use client';

import { QuestionsApi } from '@/api';
import { Category, Paginated, UiState } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Categories.module.css';

type Props = {
  tag?: string;
  popular?: boolean;
};

export default function Categories({}: Props) {
  const [uiState, setUiState] = useState<UiState>('initial');
  const [categories, setCategories] = useState<Paginated<Category> | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setUiState('loading');

      const api = new QuestionsApi();
      const categoriesResponse = await api.getCategories(currentPage);

      if (!categoriesResponse) {
        setUiState('error');
      } else {
        console.log('Fetched Categories:', categoriesResponse);
        setUiState('data');
        setCategories(categoriesResponse);
      }
    }
    fetchData();
  }, [currentPage]);

  const handleDeleteCategory = async (slug: string) => {
    console.log('Deleting category with slug:', slug);
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const api = new QuestionsApi();
        const success = await api.deleteCategory(slug);

        if (success) {
          const updatedCategories = await api.getCategories(currentPage);
          setCategories(updatedCategories);
        } else {
          console.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryTitle) {
      alert('Please fill in the title.');
      return;
    }

    try {
      const api = new QuestionsApi();
      const newCategory = await api.createCategory({
        title: newCategoryTitle,
      });

      if (newCategory) {
        const updatedCategories = await api.getCategories(currentPage);
        setCategories(updatedCategories);
        setNewCategoryTitle('');
        setShowCreateForm(false);
      } else {
        console.error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleNextPage = () => {
    if (categories && currentPage < categories.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.cats}>
      {/* Display categories */}
      {uiState === 'loading' && <p>Sæki flokka</p>}
      {uiState === 'error' && <p>Villa við að sækja flokka</p>}
      {uiState === 'data' && (
        <>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={styles.createButton}
          >
            {showCreateForm ? 'Cancel' : 'Create New Category'}
          </button>

          {showCreateForm && (
            <div className={styles.createForm}>
              <input
                type="text"
                placeholder="Category Title"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
              />
              <button onClick={handleCreateCategory} className={styles.submitButton}>
                Create
              </button>
            </div>
          )}

          <ul className={styles.categoryList}>
            {categories?.data.map((category, index) => (
              <li key={index} className={styles.categoryItem}>
                <Link href={`/flokkar/${category.slug}`}>{category.title}</Link>
                <button
                  onClick={() => handleDeleteCategory(category.slug)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.pagination}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {categories?.pagination.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === categories?.pagination.totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}