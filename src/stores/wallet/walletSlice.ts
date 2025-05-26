import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EActionStatus, FetchError } from '../type';
import {
  IGetTrustScoreHistoryWalletParams,
  ITrustScoreHistoryWalletState,
  IWalletTrustScoreHistory
} from './type';
import serviceWallet from '@/src/services/external-services/backend-server/wallet';
import { AxiosError } from 'axios';

const initialState: ITrustScoreHistoryWalletState = {
  status: EActionStatus.Idle,
  errorCode: '',
  errorMessage: '',
  trustScoreHistoryWallet: [],
  openModalHistoryWallet: false
};

export const getTrustScoreHistoryWallet = createAsyncThunk<
  IWalletTrustScoreHistory[],
  IGetTrustScoreHistoryWalletParams,
  { rejectValue: FetchError }
>('wallet/getTrustScoreHistoryWallet', async (params, { rejectWithValue }) => {
  try {
    const data = await serviceWallet.getTrustScoreHistoryWallet(params);
    const listHistoryWallet = await data.json();
    return listHistoryWallet.data.userTrustScoreHistories;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    return rejectWithValue({
      errorMessage: responseData?.message,
      errorCode: responseData?.code
    });
  }
});

export const trustScoreHistoryWalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetTrustScoreHistoryWallet: (state) => {
      return initialState;
    },
    setOpenModalHistoryWallet: (
      state,
      action: PayloadAction<{ isOpenModalHistoryWallet: boolean }>
    ) => {
      state.openModalHistoryWallet = action.payload.isOpenModalHistoryWallet;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrustScoreHistoryWallet.pending, (state) => {
        state.status = EActionStatus.Pending;
      })
      .addCase(getTrustScoreHistoryWallet.fulfilled, (state, action) => {
        state.status = EActionStatus.Succeeded;
        state.trustScoreHistoryWallet = action.payload;
      })
      .addCase(getTrustScoreHistoryWallet.rejected, (state, action) => {
        state.status = EActionStatus.Failed;
        state.errorCode = action.payload?.errorCode || '';
        state.errorMessage = action.payload?.errorMessage || '';
      });
  }
});

export const { resetTrustScoreHistoryWallet, setOpenModalHistoryWallet } =
  trustScoreHistoryWalletSlice.actions;
export default trustScoreHistoryWalletSlice.reducer;
