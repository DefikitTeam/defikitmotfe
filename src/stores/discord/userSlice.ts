import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { DiscordUser, DiscordUserState } from './type';

const initialState: DiscordUserState = {
  discord: null,
  isLoading: false,
  error: null
};

const discordUserSlice = createSlice({
  name: 'discordUser',
  initialState,
  reducers: {
    setDiscordUser: (state, action: PayloadAction<DiscordUser>) => {
      state.discord = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.discord = null;
      state.isLoading = false;
    },
    logout: (state) => {
      state.discord = null;
      state.error = null;
      state.isLoading = false;
    }
  }
});

export const { setDiscordUser, setLoading, setError, logout } =
  discordUserSlice.actions;
export default discordUserSlice.reducer;
