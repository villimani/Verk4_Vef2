import Link from "next/link";
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>Front Page</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/flokkar" className={styles.navLink}>Categories</Link>
        </li>
      </ul>
    </nav>
  );
}