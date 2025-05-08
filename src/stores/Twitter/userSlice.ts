import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TwitterUser, UserState } from './type';

const initialState: UserState = {
    twitter: null,
    isLoading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setTwitterUser: (state, action: PayloadAction<TwitterUser>) => {
            state.twitter = action.payload;
            state.error = null;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.twitter = null;
            state.isLoading = false;
        },
        logout: (state) => {
            state.twitter = null;
            state.error = null;
            state.isLoading = false;
        }
    }
});

export const { setTwitterUser, setLoading, setError, logout } =
    userSlice.actions;
export default userSlice.reducer;
