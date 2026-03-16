import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';
import { loadUser } from './features/auth/authSlice';
import './i18n'; // Initialize i18n
import './shared/styles/variables.css';

// Load user if token exists
const token = localStorage.getItem('token');
if (token) {
    store.dispatch(loadUser());
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
