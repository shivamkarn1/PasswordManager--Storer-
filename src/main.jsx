import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Initialize lord-icon element
defineElement(lottie.loadAnimation);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
