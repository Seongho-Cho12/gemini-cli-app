import React from 'react';
import ReactDOM from 'react-dom/client'; // /client 추가
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);