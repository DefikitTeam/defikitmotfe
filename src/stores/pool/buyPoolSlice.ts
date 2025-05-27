import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBuyPool } from './type';

const initialState: IBuyPool = {
  poolAddress: '',
  // numberBatch: 0,
  payableAmount: 0,
  // maxAmountETH: 0
  amountBera: ''
};

export const poolBuySlice = createSlice({
  name: 'poolBuy',
  initialState,
  reducers: {
    updateBuyPoolInformation: (
      state: IBuyPool,
      action: PayloadAction<IBuyPool>
    ) => {
      // state.maxAmountETH = action.payload.maxAmountETH;
      // state.numberBatch = action.payload.numberBatch;
      state.payableAmount = action.payload.payableAmount;
      state.poolAddress = action.payload.poolAddress;
      state.amountBera = action.payload.amountBera;
    },
    resetBuyPoolInformation: () => {
      return initialState;
    }
  }
});

export const { updateBuyPoolInformation, resetBuyPoolInformation } =
  poolBuySlice.actions;
export default poolBuySlice.reducer;
