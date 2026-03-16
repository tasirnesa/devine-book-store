import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../shared/services/axiosInstance';

export const fetchLanguages = createAsyncThunk('languages/fetchLanguages', async () => {
    const response = await axiosInstance.get('/languages');
    return response.data.data;
});

const languageSlice = createSlice({
    name: 'languages',
    initialState: {
        items: [],
        currentLanguage: localStorage.getItem('i18nextLng') || 'en',
        loading: false,
        error: null,
    },
    reducers: {
        setLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLanguages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLanguages.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchLanguages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
