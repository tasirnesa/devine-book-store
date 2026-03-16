import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'users',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
    },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;
