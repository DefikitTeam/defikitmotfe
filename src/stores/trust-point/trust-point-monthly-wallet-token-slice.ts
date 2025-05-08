/* eslint-disable */
import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
    IGetTop100TrustPointWalletAndTokenMonthlyQuery,
    IGetTop100TrustPointWalletAndTokenMonthlyResponse,
    IGetTop100TrustPointWalletAndTokenWeeklyQuery,
    IGetTop100TrustPointWalletAndTokenWeeklyResponse
} from '../pool/type';
import { EActionStatus, FetchError } from '../type';
import { ITrustPointMonthlyWalletTokenState } from './type';

const initialState: ITrustPointMonthlyWalletTokenState = {
    status: EActionStatus.Failed,
    errorMessage: '',
    errorCode: '',
    data: {
        userTrustScoreMonthlies: [],
        poolTrustScoreMonthlies: []
    }
};

export const getTop100TPMonthlyWalletAndToken = createAsyncThunk<
    IGetTop100TrustPointWalletAndTokenMonthlyResponse,
    IGetTop100TrustPointWalletAndTokenMonthlyQuery,
    {
        rejectValue: FetchError;
    }
>(
    'trust-point/getTop100TPMonthlyWalletAndToken',
    async (params, { rejectWithValue }) => {
        try {
            const { chainId } = params;
            const data =
                await servicePool.getTop100TrustPointWalletAndTokenMonthly(
                    params
                );
            const listTPMonthly = await data.json();
            return {
                data: listTPMonthly.data
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

export const trustPointMonthlyWalletTokenSlice = createSlice({
    name: 'trustPointMonthlyWalletTokenSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTop100TPMonthlyWalletAndToken.pending, (state) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(
                getTop100TPMonthlyWalletAndToken.fulfilled,
                (state, action) => {
                    state.status = EActionStatus.Succeeded;
                    state.data.poolTrustScoreMonthlies =
                        action.payload.data.poolTrustScoreMonthlies;
                    state.data.userTrustScoreMonthlies =
                        action.payload.data.userTrustScoreMonthlies;
                }
            )
            .addCase(
                getTop100TPMonthlyWalletAndToken.rejected,
                (state, action) => {
                    state.status = EActionStatus.Failed;
                    state.errorCode = action.payload?.errorCode || '';
                    state.errorMessage = action.payload?.errorMessage || '';
                }
            );
    }
});

export const {} = trustPointMonthlyWalletTokenSlice.actions;
export default trustPointMonthlyWalletTokenSlice.reducer;
