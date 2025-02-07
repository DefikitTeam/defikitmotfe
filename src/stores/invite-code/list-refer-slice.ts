/* eslint-disable */
import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';
import { IGetAllDataResponse } from '@/src/services/response.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { IGetAllQuery } from '../pool/type';
import { EActionStatus, FetchError } from '../type';
import { IInviteListRefer, IInviteReferItem } from './type';

const initialState: IInviteListRefer = {
    status: EActionStatus.Idle,
    errorMessage: '',
    errorCode: '',
    data: [],
    page: 1,
    limit: 1000,
    totalInviteListRefer: 0,
    isOpenModalInviteListRefer: false
};

export const getInviteListRefer = createAsyncThunk<
    IGetAllDataResponse<IInviteReferItem>,
    IGetAllQuery,
    {
        rejectValue: FetchError;
    }
>('inviteListRefer/getInviteListRefer', async (params, { rejectWithValue }) => {
    try {
        const data = await serviceInviteCode.getAllReferrer(params);
        return data;
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

const inviteListReferSlice = createSlice({
    name: 'inviteListRefer',
    initialState,
    reducers: {
        setOpenModalInviteListRefer: (
            state,
            action: PayloadAction<{ isOpenModalInviteListRefer: boolean }>
        ) => {
            state.isOpenModalInviteListRefer =
                action.payload.isOpenModalInviteListRefer;
        },
        resetInviteListRefer: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInviteListRefer.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded;
                state.data = action.payload.items ?? [];
                state.totalInviteListRefer =
                    action.payload.meta.totalItems ?? 0;
            })
            .addCase(getInviteListRefer.pending, (state, action) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(getInviteListRefer.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorMessage = action.payload?.errorMessage ?? '';
                state.errorCode = action.payload?.errorCode ?? '';
            });
    }
});

export const { setOpenModalInviteListRefer, resetInviteListRefer } =
    inviteListReferSlice.actions;

export default inviteListReferSlice.reducer;
