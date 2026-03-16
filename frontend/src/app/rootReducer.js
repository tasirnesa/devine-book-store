import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice';
import authReducer from '../features/auth/authSlice';
import languageReducer from '../features/languages/languageSlice';
import userReducer from '../features/users/userSlice';

const rootReducer = combineReducers({
    books: bookReducer,
    auth: authReducer,
    languages: languageReducer,
    users: userReducer,
});

export default rootReducer;
