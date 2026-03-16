// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    // middleware, devTools etc. can be added later
});

export default store;
