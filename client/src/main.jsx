import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Internal Imports
import App from './App.jsx';
import { store } from './app/store';
import { ToastProvider } from './context/ToastContext';
import { setupInterceptors } from './utils/axios'; // Ensure this file exists (see below)
import './index.css';

// Initialize Axios Interceptors (Inject store to handle 401 tokens globally)
setupInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
);