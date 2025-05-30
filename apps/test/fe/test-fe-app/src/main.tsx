import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mono/styles/base-styles.scss';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
