import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISellPool } from './type';

const initialState: ISellPool = {
    poolAddress: '',
    numberBatch: 0,
    payableAmount: 0,
    maxAmountETH: 0
};

export const poolSellSlice = createSlice({
    name: 'poolSell',
    initialState,
    reducers: {
        updateSellPoolInformation: (
            state: ISellPool,
            action: PayloadAction<ISellPool>
        ) => {
            state.maxAmountETH = action.payload.maxAmountETH;
            state.numberBatch = action.payload.numberBatch;
            state.payableAmount = action.payload.payableAmount;
            state.poolAddress = action.payload.poolAddress;
        },
        resetSellPoolInformation: () => {
            return initialState;
        }
    }
});

export const { resetSellPoolInformation, updateSellPoolInformation } =
    poolSellSlice.actions;
export default poolSellSlice.reducer;
