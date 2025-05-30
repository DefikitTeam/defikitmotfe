import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EActionStatus } from '../type';
import { IVestingState } from './type';

const initialState: IVestingState = {
  status: EActionStatus.Idle,
  openModalVesting: false,
  errorCode: '',
  errorMessage: ''
};

const vestingSlice = createSlice({
  name: 'vestingSlice',
  initialState,
  reducers: {
    setIsOpenModalVesting: (
      state,
      action: PayloadAction<{ isOpenModalVesting: boolean }>
    ) => {
      state.openModalVesting = action.payload.isOpenModalVesting;
    }
  }
});
export const { setIsOpenModalVesting } = vestingSlice.actions;
export default vestingSlice.reducer;
