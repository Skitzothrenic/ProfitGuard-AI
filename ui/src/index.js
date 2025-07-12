// File: /ui/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';  // React 18 rendering API
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
