/* eslint-disable */

import serviceAuth from '@/src/services/external-services/backend-server/auth';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import {
    IAuthState,
    IDataUserLoginResponse,
    ILoginRequest,
    ILoginResponse,
    ILoginTeleResponse,
    ILoginWalletResponse,
    ISignature
} from './type';

const initialState: IAuthState = {
    statusLoginWallet: EActionStatus.Idle,
    statusLoginTele: EActionStatus.Idle,
    errorMessage: '',
    errorCode: '',
    userInfo: serviceAuth.getUserInfoStorage(),
    userTele: serviceAuth.getUserTeleStorage(),
    userWallet: serviceAuth.getUserWalletStorage(),
    signature: ''
};

export const loginWallet = createAsyncThunk<
    ILoginResponse,
    ILoginRequest,
    {
        rejectValue: FetchError;
    }
>('auth/loginWallet', async (loginData, { rejectWithValue }) => {
    try {
        const loginResponse: ILoginResponse =
            await serviceAuth.loginWallet(loginData);
        const { user, tele, wallet } = loginResponse;
        if (!serviceAuth.getUserInfoStorage()) {
            serviceAuth.storeUserInfo(user as IDataUserLoginResponse);
        }
        if (!serviceAuth.getUserTeleStorage()) {
            serviceAuth.storeUserTele(tele as ILoginTeleResponse);
        }
        if (!serviceAuth.getUserWalletStorage()) {
            serviceAuth.storeUserWallet(wallet as ILoginWalletResponse);
        }
        return loginResponse;
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOutTelegram: (state: IAuthState) => {
            state.errorMessage = '';
            state.errorCode = '';
            state.statusLoginTele = EActionStatus.Idle;
            if (!state.userWallet) {
                state.userInfo = null;
            }
            state.userTele = null;
            serviceAuth.storeUserTele(null);
            if (!serviceAuth.getUserWalletStorage()) {
                serviceAuth.storeUserInfo(null);
            }
        },
        signOutWallet: (state: IAuthState) => {
            state.errorMessage = '';
            state.errorCode = '';
            state.statusLoginWallet = EActionStatus.Idle;

            if (!state.userTele) {
                state.userInfo = null;
            }
            state.userWallet = null;
            state.signature = '';
            servicePool.storeReferId(null);
            serviceAuth.storeUserWallet(null);
            if (!serviceAuth.getUserTeleStorage()) {
                serviceAuth.storeUserInfo(null);
            }
        },
        resetStatusLoginTele: (state: IAuthState) => {
            state.statusLoginTele = EActionStatus.Idle;
        },
        resetStatusLoginWallet: (state: IAuthState) => {
            state.statusLoginWallet = EActionStatus.Idle;
        },
        updateSignature: (
            state: IAuthState,
            action: PayloadAction<ISignature>
        ) => {
            state.signature = action.payload.signature;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginWallet.pending, (state) => {
            state.statusLoginWallet = EActionStatus.Pending;
        });
        builder.addCase(
            loginWallet.fulfilled,
            (state: IAuthState, action: PayloadAction<ILoginResponse>) => {
                if (action.payload.tele) {
                    state.userTele = action.payload.tele;
                    state.statusLoginTele = EActionStatus.Succeeded;
                }
                if (action.payload.user) {
                    state.userInfo = action.payload.user;
                }
                if (action.payload.wallet) {
                    state.userWallet = action.payload?.wallet;
                    state.statusLoginWallet = EActionStatus.Succeeded;
                }
            }
        );
        builder.addCase(loginWallet.rejected, (state: IAuthState, action) => {
            state.statusLoginWallet = EActionStatus.Failed;
            state.errorMessage = action.payload?.errorMessage || '';
            state.errorCode = action.payload?.errorCode || '';
        });
    }
});

export const {
    signOutTelegram,
    signOutWallet,
    resetStatusLoginTele,
    resetStatusLoginWallet,
    updateSignature
} = authSlice.actions;

export default authSlice.reducer;
