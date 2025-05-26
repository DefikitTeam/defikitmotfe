import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepositLottery } from './type';

const initialState: IDepositLottery = {
  poolAddress: '',
  referrer: '',
  depositAmount: 0
};

export const depositLotterySlice = createSlice({
  name: 'depositLottery',
  initialState,
  reducers: {
    updateDepositLotteryInformation: (
      state: IDepositLottery,
      action: PayloadAction<IDepositLottery>
    ) => {
      state.depositAmount = action.payload.depositAmount;
      state.poolAddress = action.payload.poolAddress;
      state.referrer = action.payload.referrer;
    },
    resetDepositLotteryInformation: () => {
      return initialState;
    }
  }
});

export const {
  updateDepositLotteryInformation,
  resetDepositLotteryInformation
} = depositLotterySlice.actions;

export default depositLotterySlice.reducer;
