import { useState } from 'react';
import { Button, Link, Header } from '@mono/components';
import { AccessibilityDemo } from './AccessibilityDemo';
import { Home, Settings, BookOpen } from 'lucide-react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import styles from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCountClick = () => {
    setIsLoading(true);
    setCount(count => count + 1);
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleProfileClick = () => {
    alert('Profile clicked!');
  };

  const handleLogoClick = () => {
    alert('Logo clicked!');
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      active: true,
      icon: Home,
      external: false,
    },
    {
      label: 'Settings',
      href: '/settings',
      active: false,
      icon: Settings,
      external: false,
    },
    {
      label: 'Docs',
      href: '/docs',
      active: false,
      icon: BookOpen,
      external: false,
    },
  ];

  return (
    <div className={styles.app}>
      <Header
        logo='Frontend Platform'
        navItems={navItems}
        showProfile={true}
        onProfileClick={handleProfileClick}
        onLogoClick={handleLogoClick}
        variant='default'
        fixed={false}
      />

      <div className={styles.hero}>
        <h1 className={styles.title}>Frontend Platform</h1>
        <p className={styles.subtitle}>
          A modern TypeScript monorepo with unified development tooling, shared
          component libraries, and elegant design system.
        </p>
      </div>

      <div className={styles.logoSection}>
        <Link
          href='https://vitejs.dev'
          external
          variant='primary'
          size='medium'
        >
          <img src={viteLogo} className={styles.logo} alt='Vite logo' />
        </Link>
        <Link href='https://react.dev' external variant='primary' size='medium'>
          <img
            src={reactLogo}
            className={`${styles.logo} ${styles.reactLogo}`}
            alt='React logo'
          />
        </Link>
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
            onClick={handleCountClick}
            variant='primary'
            size='medium'
            loading={isLoading}
          >
            Count is {count}
          </Button>

          <Button variant='secondary' size='medium'>
            Secondary Action
          </Button>

          <Button variant='outline' size='small'>
            Learn More
          </Button>

          <Button variant='outline' size='large' isDisabled>
            Disabled Button
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          <h3>Link Component Examples</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href='#' variant='primary' size='small'>
              Primary Link
            </Link>

            <Link href='#' variant='secondary' size='medium'>
              Secondary Link
            </Link>

            <Link href='#' variant='muted' size='large'>
              Muted Link
            </Link>

            <Link href='#' variant='danger' size='medium'>
              Danger Link
            </Link>

            <Link
              href='https://github.com'
              external
              variant='primary'
              size='medium'
            >
              External Link
            </Link>

            <Link href='#' variant='primary' size='medium' underline>
              Underlined Link
            </Link>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          Click on the Vite and React logos to learn more.{' '}
          <Link
            href='https://vitejs.dev/guide/'
            external
            variant='primary'
            size='medium'
          >
            Read the docs
          </Link>
        </p>
      </footer>

      <AccessibilityDemo />
    </div>
  );
}

export default App;
