import { useState } from 'react';
import { Button } from '@mono/ui';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import styles from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Luxury Real Estate Platform</h1>
        <p className={styles.subtitle}>
          A modern TypeScript monorepo with unified development tooling, shared
          component libraries, and elegant design system.
        </p>
      </div>

      <div className={styles.logoSection}>
        <a
          href='https://vitejs.dev'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.logoLink}
        >
          <img src={viteLogo} className={styles.logo} alt='Vite logo' />
        </a>
        <a
          href='https://react.dev'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.logoLink}
        >
          <img
            src={reactLogo}
            className={`${styles.logo} ${styles.reactLogo}`}
            alt='React logo'
          />
        </a>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <p className={styles.cardText}>
            Edit <code className={styles.codeSnippet}>src/App.tsx</code> and
            save to test HMR
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            onClick={() => setCount(count => count + 1)}
            variant='primary'
            size='medium'
          >
            Count is {count}
          </Button>

          <Button variant='secondary' size='medium'>
            Secondary Action
          </Button>

          <Button variant='outline' size='small'>
            Learn More
          </Button>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          Click on the Vite and React logos to learn more.{' '}
          <a
            href='https://vitejs.dev/guide/'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.docsLink}
          >
            Read the docs
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
