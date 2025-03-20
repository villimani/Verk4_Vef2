'use client';

import { QuestionsApi } from '@/api';
import { Category as CategoryType } from '@/types';
import { useEffect, useState } from 'react';
import styles from './Category.module.css'; 

export function Category({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const api = new QuestionsApi();
      const response = await api.getCategory(slug);
      setCategory(response);
    }
    fetchData();
  }, [slug]);

  if (!category) {
    return <p>Flokkur fannst ekki</p>;
  }

  return (
    <div className={styles.container}> {/* Apply the container style */}
      <h2 className={styles.title}>Questions in Category: {category.title}</h2> {/* Apply the title style */}
    </div>
  );
}