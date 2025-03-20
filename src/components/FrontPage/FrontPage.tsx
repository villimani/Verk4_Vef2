import React from 'react';
import styles from './BarComponent.module.css'; 

const BarComponent = () => {
  return (
    <div className={styles.bar}>
      <p className={styles.text}>Welcome! You can start to create and do quizes by selecting the Category page in the top right corner!</p>
    </div>
  );
};

export default BarComponent;