/* eslint-disable */
import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
    IGetTop100TrustPointWalletAndTokenQuery,
    IGetTop100TrustPointWalletAndTokenResponse
} from '../pool/type';
import { EActionStatus, FetchError } from '../type';
import { ITrustPointDailyWalltTokenState } from './type';

const initialState: ITrustPointDailyWalltTokenState = {
    status: EActionStatus.Failed,
    errorMessage: '',
    errorCode: '',
    data: {
        userTrustScoreDailies: [],
        poolTrustScoreDailies: []
    }
};

export const getTop100TPDailyWalletAndToken = createAsyncThunk<
    IGetTop100TrustPointWalletAndTokenResponse,
    IGetTop100TrustPointWalletAndTokenQuery,
    {
        rejectValue: FetchError;
    }
>(
    'trust-point/getTop100TPDailyWalletAndToken',
    async (params, { rejectWithValue }) => {
        try {
            const { chainId } = params;
            const data =
                await servicePool.getTop100TrustPointWalletAndToken(params);
            const listTPDaily = await data.json();
            return {
                data: listTPDaily.data
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
    name: 'trustPointDailyWalletTokenSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTop100TPDailyWalletAndToken.pending, (state) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(
                getTop100TPDailyWalletAndToken.fulfilled,
                (state, action) => {
                    state.status = EActionStatus.Succeeded;
                    state.data.poolTrustScoreDailies =
                        action.payload.data.poolTrustScoreDailies;
                    state.data.userTrustScoreDailies =
                        action.payload.data.userTrustScoreDailies;
                }
            )
            .addCase(
                getTop100TPDailyWalletAndToken.rejected,
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
