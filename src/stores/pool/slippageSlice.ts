import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EActionStatus } from '../type';
import { ISettingSlippageState } from './type';

const initialState: ISettingSlippageState = {
    slippage: 5,
    sellSlippage: 5,
    status: EActionStatus.Idle,
    openModalSlippage: false,
    openModalSellSippage: false,
    errorCode: '',
    errorMessage: ''
};
export const slippageSlice = createSlice({
    name: 'slippageSlice',
    initialState,
    reducers: {
        setOpenModalSlippage: (
            state,
            action: PayloadAction<{ isOpenModalSlippage: boolean }>
        ) => {
            state.openModalSlippage = action.payload.isOpenModalSlippage;
        },
        setValueSlippage: (
            state,
            action: PayloadAction<{ slippage: number }>
        ) => {
            state.slippage = action.payload.slippage;
        },
        setValueSellSlippage: (
            state,
            action: PayloadAction<{ sellSlippage: number }>
        ) => {
            state.sellSlippage = action.payload.sellSlippage;
        },
        setOpenModalSellSlippage: (
            state,
            action: PayloadAction<{ isOpenModalSellSlippage: boolean }>
        ) => {
            state.openModalSellSippage = action.payload.isOpenModalSellSlippage;
        }
    }
});
export const {
    setOpenModalSlippage,
    setValueSlippage,
    setOpenModalSellSlippage,
    setValueSellSlippage
} = slippageSlice.actions;
export default slippageSlice.reducer;
