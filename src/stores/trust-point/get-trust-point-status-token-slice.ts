/* eslint-disable */
import serviceTrustPoint from '@/src/services/external-services/backend-server/trust-point';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import { IGetTrustPointResponse, IGetTrustPointStatusState } from './type';

const initialState: IGetTrustPointStatusState = {
    status: EActionStatus.Idle,
    errorMessage: '',
    errorCode: '',
    data: []
};

export const getTrustPointToken = createAsyncThunk<
    { data: IGetTrustPointResponse },
    { poolAddress: string },
    {
        rejectValue: FetchError;
    }
>(
    'getTrustPointStatusToken/getTrustPointToken',
    async ({ poolAddress }, { rejectWithValue }) => {
        try {
            const data =
                await serviceTrustPoint.getTrustPointToken(poolAddress);
            if (!data) {
                throw new Error('No data from call get trust point status');
            }
            return { data: data };
        } catch (error) {
            const err = error as AxiosError;
            const responseData: any = err.response?.data;
            const responseStatus: any = err.response?.status || 0;
            return rejectWithValue({
                errorMessage: responseData?.error,
                errorCode: responseStatus
            });
        }
    }
);

const getTrustPointTokenSlice = createSlice({
    name: 'getTrustPointStatusToken',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getTrustPointToken.fulfilled,
                (
                    state,
                    action: PayloadAction<{ data: IGetTrustPointResponse }>
                ) => {
                    state.status = EActionStatus.Succeeded;
                    state.data = action.payload.data.data;
                }
            )
            .addCase(getTrustPointToken.pending, (state, action) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(getTrustPointToken.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorMessage = action.payload?.errorMessage ?? '';
                state.errorCode = action.payload?.errorCode ?? '';
            });
    }
});

export const {} = getTrustPointTokenSlice.actions;
export default getTrustPointTokenSlice.reducer;
