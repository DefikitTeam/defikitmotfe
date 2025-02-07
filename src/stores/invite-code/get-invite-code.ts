/* eslint-disable */

import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import { IGetInviteCodeResponse, IGetInviteCodeState } from './type';

const initialState: IGetInviteCodeState = {
    status: EActionStatus.Idle,
    errorMessage: '',
    errorCode: '',
    data: [],
    isOpenModalGetListCurrentCode: false
};

export const getInviteCode = createAsyncThunk<
    { data: IGetInviteCodeResponse },
    void,
    {
        rejectValue: FetchError;
    }
>('getInviteCodeRefer/getInviteCode', async (_, { rejectWithValue }) => {
    try {
        const data = await serviceInviteCode.getInviteCode();
        if (!data) {
            throw new Error('No data from call get invite code ');
        }
        const formatData = {
            data: data
        };
        return formatData;
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

const getInviteCodeSlice = createSlice({
    name: 'getInviteCodeRefer',
    initialState,
    reducers: {
        setIsOpenModalGetListCurrentCode: (
            state,
            action: PayloadAction<{ isOpenModalGetListCurrentCode: boolean }>
        ) => {
            state.isOpenModalGetListCurrentCode =
                action.payload.isOpenModalGetListCurrentCode;
        },

        resetGetInviteCodeRefer: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getInviteCode.fulfilled,
                (
                    state,
                    action: PayloadAction<{ data: IGetInviteCodeResponse }>
                ) => {
                    state.status = EActionStatus.Succeeded;
                    state.data = action.payload.data.data;
                }
            )
            .addCase(getInviteCode.pending, (state, action) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(getInviteCode.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorMessage = action.payload?.errorMessage ?? '';
                state.errorCode = action.payload?.errorCode ?? '';
            });
    }
});

export const { setIsOpenModalGetListCurrentCode, resetGetInviteCodeRefer } =
    getInviteCodeSlice.actions;
export default getInviteCodeSlice.reducer;
