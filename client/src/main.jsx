import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { setupInterceptors } from './utils/axios';
import { ToastProvider } from './context/ToastContext'; // <--- MUST BE HERE
import App from './App.jsx';
import './index.css';

setupInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider> {/* <--- MUST WRAP APP */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
);