// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { EActionStatus, FetchError } from '../type';
// import {
//     ICheckInviteCodeRequest,
//     ICheckInviteCodeResponse,
//     ICheckInviteCodeState
// } from './type';
// import { AxiosError } from 'axios';
// import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';

// const initialState: ICheckInviteCodeState = {
//     status: EActionStatus.Idle,
//     errorMessage: '',
//     errorCode: '',
//     data: ''
// };

// export const getCheckInviteCode = createAsyncThunk<
//     ICheckInviteCodeResponse,
//     ICheckInviteCodeRequest,
//     {
//         rejectValue: FetchError;
//     }
// >('checkInviteCode/getCheckInviteCode', async (params, { rejectWithValue }) => {
//     try {
//         const data = await serviceInviteCode.checkInviteCode(params);

//         if (!data) {
//             throw new Error('No data from call check invite code');
//         }
//         return data;
//     } catch (error) {
//         const err = error as AxiosError;
//         const responseData: any = err.response?.data;
//         const responseStatus: any = err.response?.status || 0;
//         return rejectWithValue({
//             errorMessage: responseData?.error,
//             errorCode: responseStatus
//         });
//     }
// });

// const checkInviteCodeSlice = createSlice({
//     name: 'checkInviteCode',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(getCheckInviteCode.fulfilled, (state, action) => {
//                 state.status = EActionStatus.Succeeded;
//                 state.data = action.payload.refId;
//             })
//             .addCase(getCheckInviteCode.pending, (state, action) => {
//                 state.status = EActionStatus.Pending;
//             })
//             .addCase(getCheckInviteCode.rejected, (state, action) => {
//                 state.status = EActionStatus.Failed;
//                 state.errorMessage = action.payload?.errorMessage ?? '';
//                 state.errorCode = action.payload?.errorCode ?? '';
//             });
//     }
// });

// export default checkInviteCodeSlice.reducer;
