/* eslint-disable */
import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
    IGetTop100TrustPointWalletAndTokenWeeklyQuery,
    IGetTop100TrustPointWalletAndTokenWeeklyResponse
} from '../pool/type';
import { EActionStatus, FetchError } from '../type';
import { ITrustPointWeeklyWalletTokenState } from './type';

const initialState: ITrustPointWeeklyWalletTokenState = {
    status: EActionStatus.Failed,
    errorMessage: '',
    errorCode: '',
    data: {
        userTrustScoreWeeklies: [],
        poolTrustScoreWeeklies: []
    }
};

export const getTop100TPWeeklyWalletAndToken = createAsyncThunk<
    IGetTop100TrustPointWalletAndTokenWeeklyResponse,
    IGetTop100TrustPointWalletAndTokenWeeklyQuery,
    {
        rejectValue: FetchError;
    }
>(
    'trust-point/getTop100TPWeeklyWalletAndToken',
    async (params, { rejectWithValue }) => {
        try {
            const { chainId } = params;
            const data =
                await servicePool.getTop100TrustPointWalletAndTokenWeekly(
                    params
                );
            const listTPWeekly = await data.json();
            return {
                data: listTPWeekly.data
            };
        } catch (error) {
            const err = error as AxiosError;
            const responseData: any = err.response?.data;
            return rejectWithValue({
                errorMessage: responseData?.message,
                errorCode: responseData?.code
            });
        }
    }
);

export const trustPointDailyWalletTokenSlice = createSlice({
    name: 'trustPointWeeklyWalletTokenSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTop100TPWeeklyWalletAndToken.pending, (state) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(
                getTop100TPWeeklyWalletAndToken.fulfilled,
                (state, action) => {
                    state.status = EActionStatus.Succeeded;
                    state.data.poolTrustScoreWeeklies =
                        action.payload.data.poolTrustScoreWeeklies;
                    state.data.userTrustScoreWeeklies =
                        action.payload.data.userTrustScoreWeeklies;
                }
            )
            .addCase(
                getTop100TPWeeklyWalletAndToken.rejected,
                (state, action) => {
                    state.status = EActionStatus.Failed;
                    state.errorCode = action.payload?.errorCode || '';
                    state.errorMessage = action.payload?.errorMessage || '';
                }
            );
    }
});

export const {} = trustPointDailyWalletTokenSlice.actions;
export default trustPointDailyWalletTokenSlice.reducer;
