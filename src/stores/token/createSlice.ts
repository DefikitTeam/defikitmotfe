/* eslint-disable */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateToken } from './type';

const initialState: ICreateToken = {
    name: '',
    symbol: '',
    decimal: '18',
    totalSupply: '1000000000'
};

export const tokenCreateSlice = createSlice({
    name: 'tokenCreateSlice',
    initialState,
    reducers: {
        updateCreateTokenInformation: (
            state: ICreateToken,
            action: PayloadAction<ICreateToken>
        ) => {
            return action.payload;
        },
        resetCreateTokenData: () => {
            return initialState;
        }
    }
});

export const { resetCreateTokenData, updateCreateTokenInformation } =
    tokenCreateSlice.actions;
export default tokenCreateSlice.reducer;
