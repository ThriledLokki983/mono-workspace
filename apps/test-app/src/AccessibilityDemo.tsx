import React, { useState } from 'react';
import { Button, Link } from '@mono/ui';

export const AccessibilityDemo: React.FC = () => {
  const [focusCount, setFocusCount] = useState(0);
  const [pressCount, setPressCount] = useState(0);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>React Aria Accessibility Features Demo</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Keyboard Navigation & Focus Management</h3>
        <p>Use Tab, Shift+Tab, Enter, and Space to navigate and interact:</p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            margin: '1rem 0',
          }}
        >
          <Button
            variant='primary'
            size='medium'
            onFocus={() => setFocusCount(f => f + 1)}
            onPress={() => setPressCount(p => p + 1)}
          >
            Focusable Button
          </Button>

          <Button variant='secondary' size='medium' isDisabled>
            Disabled Button (Skip in tab order)
          </Button>

          <Link
            href='#demo'
            variant='primary'
            onFocus={() => setFocusCount(f => f + 1)}
          >
            Focusable Link
          </Link>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--color-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p>
            <strong>Focus Events:</strong> {focusCount}
          </p>
          <p>
            <strong>Button Press Events:</strong> {pressCount}
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Screen Reader Support</h3>
        <p>These components include proper ARIA attributes:</p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            margin: '1rem 0',
          }}
        >
          <Button variant='primary' size='medium' loading={true}>
            Loading Button (aria-busy="true")
          </Button>

          <Link
            href='https://react-spectrum.adobe.com/react-aria/'
            external
            variant='primary'
          >
            External Link (aria-describedby for external indicator)
          </Link>
        </div>
      </section>

      <section>
        <h3>Responsive & Touch-Friendly</h3>
        <p>Components work well on touch devices with proper touch targets:</p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            margin: '1rem 0',
          }}
        >
          <Button variant='primary' size='small'>
            Small Touch Target
          </Button>
          <Button variant='primary' size='medium'>
            Medium Touch Target
          </Button>
          <Button variant='primary' size='large'>
            Large Touch Target
          </Button>
        </div>
      </section>
    </div>
  );
};
