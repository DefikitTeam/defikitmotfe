/* eslint-disable */
import servicePool from '@/src/services/external-services/backend-server/pool';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Transaction } from 'ethers';
import { EActionStatus, FetchError } from '../type';
import { IActivitiesState, IGetTransactionByPoolAndSenderParams } from './type';

const initialState: IActivitiesState = {
  status: EActionStatus.Idle,
  openModalActivities: false,
  transactionList: [],
  errorCode: '',
  errorMessage: ''
};

export const getAllTransactionByPoolAndSernder = createAsyncThunk<
  Transaction[],
  IGetTransactionByPoolAndSenderParams,
  {
    rejectValue: FetchError;
  }
>(
  'pool/getAllTransactionByPoolAndSernder',
  async (param, { rejectWithValue }) => {
    try {
      const response = await servicePool.getTransactionByPoolAndSender(param);
      const data = await response.json();
      return data.data.transactions;
    } catch (error) {
      const err = error as AxiosError;
      const responseData: any = err.response?.data;
      return rejectWithValue({
        errorMessage: responseData?.info?.message,
        errorCode: responseData?.code
      });
    }
  }
);

const activitiSlice = createSlice({
  name: 'activitiSlice',
  initialState,
  reducers: {
    setOpenModalActivities: (
      state,
      action: PayloadAction<{ isOpenModalActivities: boolean }>
    ) => {
      state.openModalActivities = action.payload.isOpenModalActivities;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTransactionByPoolAndSernder.pending, (state, action) => {
        state.status = EActionStatus.Pending;
      })
      .addCase(getAllTransactionByPoolAndSernder.fulfilled, (state, action) => {
        state.status = EActionStatus.Succeeded;
        // @ts-ignore
        state.transactionList = action.payload;
      })
      .addCase(getAllTransactionByPoolAndSernder.rejected, (state, action) => {
        (state.status = EActionStatus.Failed),
          (state.errorMessage = action?.payload?.errorMessage ?? '');
        state.errorCode = action.payload?.errorCode ?? '';
      });
  }
});

export const { setOpenModalActivities } = activitiSlice.actions;
export default activitiSlice.reducer;
