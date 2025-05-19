import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    IGetTrustScoreHistoryPoolParams,
    IPoolTrustScoreHistory,
    ITrustScoreHistoryPoolState
} from './type';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';

const initialState: ITrustScoreHistoryPoolState = {
    status: EActionStatus.Idle,
    trustScoreHistoryPool: [],
    errorCode: '',
    errorMessage: '',
    openModalHistoryPool: false
};

export const getTrustScoreHistoryPool = createAsyncThunk<
    IPoolTrustScoreHistory[],
    IGetTrustScoreHistoryPoolParams,
    {
        rejectValue: FetchError;
    }
>('pool/getTrustScoreHistoryPool', async (params, { rejectWithValue }) => {
    try {
        const data = await servicePool.getTrustScoreHistoryPool(params);
        const listHistoryPool = await data.json();
        return listHistoryPool.data.poolTrustScoreHistories;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const trustScoreHistoryPoolSlice = createSlice({
    name: 'trustScoreHistoryPool',
    initialState,
    reducers: {
        resetTrustScoreHistoryPool: (state) => {
            return initialState;
        },
        setOpenModalHistoryPool: (
            state,
            action: PayloadAction<{ isOpenModalHistoryPool: boolean }>
        ) => {
            state.openModalHistoryPool = action.payload.isOpenModalHistoryPool;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTrustScoreHistoryPool.pending, (state) => {
            state.status = EActionStatus.Pending;
        });
        builder.addCase(getTrustScoreHistoryPool.fulfilled, (state, action) => {
            state.status = EActionStatus.Succeeded;
            state.trustScoreHistoryPool = action.payload;
        });
        builder.addCase(getTrustScoreHistoryPool.rejected, (state, action) => {
            state.status = EActionStatus.Failed;
            state.errorCode = action.payload?.errorCode || '';
            state.errorMessage = action.payload?.errorMessage || '';
        });
    }
});

export const { resetTrustScoreHistoryPool, setOpenModalHistoryPool } =
    trustScoreHistoryPoolSlice.actions;
export default trustScoreHistoryPoolSlice.reducer;
