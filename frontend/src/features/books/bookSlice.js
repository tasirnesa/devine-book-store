import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../shared/services/axiosInstance';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (params = {}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/books', { params });
        return response.data; // { data: [], total: 0, page: 1, pageSize: 20 }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
    }
});

const bookSlice = createSlice({
    name: 'books',
    initialState: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
        loading: false,
        error: null,
        filters: {
            language: '',
            category: '',
            search: '',
            sort: 'newest',
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.page = 1; // Reset to first page on filter change
        },
        clearFilters: (state) => {
            state.filters = {
                language: '',
                category: '',
                search: '',
                sort: 'newest',
            };
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPage } = bookSlice.actions;
export default bookSlice.reducer;
