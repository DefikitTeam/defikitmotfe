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

export const getTrustPoint = createAsyncThunk<
    { data: IGetTrustPointResponse },
    void,
    {
        rejectValue: FetchError;
    }
>('getTrustPointStatus/getTrustPoint', async (_, { rejectWithValue }) => {
    try {
        const data = await serviceTrustPoint.getTrustPoint();
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
});

const getTrustPointSlice = createSlice({
    name: 'getTrustPointStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getTrustPoint.fulfilled,
                (
                    state,
                    action: PayloadAction<{ data: IGetTrustPointResponse }>
                ) => {
                    state.status = EActionStatus.Succeeded;
                    state.data = action.payload.data.data;
                }
            )
            .addCase(getTrustPoint.pending, (state, action) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(getTrustPoint.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorMessage = action.payload?.errorMessage ?? '';
                state.errorCode = action.payload?.errorCode ?? '';
            });
    }
});

export const {} = getTrustPointSlice.actions;
export default getTrustPointSlice.reducer;
