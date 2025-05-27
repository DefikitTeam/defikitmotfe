/* eslint-disable */

import serviceTopRefByVol from '@/src/services/external-services/backend-server/top-ref-by-vol';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';
import { EActionStatus, FetchError } from '../type';
import {
  IGetAllTopRefByVolRequest,
  ITopRefByVolItem,
  ITopRefByVolState
} from './type';

const initialState: ITopRefByVolState = {
  topRefByVols: [],
  status: EActionStatus.Idle,
  errorMessage: '',
  errorCode: ''
};

export const getAllTopRefByVol = createAsyncThunk<
  ITopRefByVolItem[],
  IGetAllTopRefByVolRequest,
  {
    rejectValue: FetchError;
  }
>('topRefByVol/getAllTopRefByVol', async (params, { rejectWithValue }) => {
  try {
    const topRefByVols = await serviceTopRefByVol.getAllTopRefByVol(
      params.chainId
    );
    const formattedReferrals = topRefByVols.data.map(
      (item: ITopRefByVolItem, index: number) => {
        const { id } = item;
        const volumeInETH = new BigNumber(item.volumeInETH)
          .div(1e18)
          .toFixed(2);
        return {
          id,
          volumeInETH
        };
      }
    );
    return formattedReferrals;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    const responseStatus: any = err.response?.status || 0;
    return rejectWithValue({
      errorMessage: responseData?.error,
      errorCode: responseStatus
    });
  }
});

const topRefByVolSlice = createSlice({
  name: 'topRefByVol',
  initialState,
  reducers: {
    resetStatusTopRefByVolState: (state: ITopRefByVolState) => {
      state.status = EActionStatus.Idle;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTopRefByVol.pending, (state) => {
        state.status = EActionStatus.Pending;
      })
      .addCase(
        getAllTopRefByVol.fulfilled,
        (state, action: PayloadAction<ITopRefByVolItem[]>) => {
          state.status = EActionStatus.Succeeded;
          state.topRefByVols = action.payload;
        }
      )
      .addCase(getAllTopRefByVol.rejected, (state, action) => {
        state.status = EActionStatus.Failed;
        state.errorMessage = action.payload?.errorMessage || '';
        state.errorCode = action.payload?.errorCode || '';
      });
  }
});

export const { resetStatusTopRefByVolState } = topRefByVolSlice.actions;
export default topRefByVolSlice.reducer;
