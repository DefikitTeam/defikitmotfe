import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISellToken } from './type';

const initialState: ISellToken = {
  poolAddress: '',
  numberBatch: 0,
  payableAmount: 0,
  maxAmountETH: 0
};

export const tokenSellSlice = createSlice({
  name: 'tokenSell',
  initialState,
  reducers: {
    updateSellTokenInformation: (
      state: ISellToken,
      action: PayloadAction<ISellToken>
    ) => {
      state.maxAmountETH = action.payload.maxAmountETH;
      state.numberBatch = action.payload.numberBatch;
      state.payableAmount = action.payload.payableAmount;
      state.poolAddress = action.payload.poolAddress;
    },
    resetSellTokenInformation: () => {
      return initialState;
    }
  }
});

export const { resetSellTokenInformation, updateSellTokenInformation } =
  tokenSellSlice.actions;
export default tokenSellSlice.reducer;
