import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/style.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext'; // Додаємо AuthProvider

// Перевірка, чи елемент root існує
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Failed to find the root element.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  
    <BrowserRouter> 
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  
);

reportWebVitals();
