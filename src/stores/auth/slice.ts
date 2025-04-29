/* eslint-disable */

import serviceAuth from '@/src/services/external-services/backend-server/auth';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import {
    IAuthState,
    IDataUserLoginResponse,
    ILoginDiscordResponse,
    ILoginRequest,
    ILoginResponse,
    ILoginTeleResponse,
    ILoginTwitterResponse,
    ILoginWalletResponse,
    ISignature
} from './type';

const initialState: IAuthState = {
    statusLoginWallet: EActionStatus.Idle,
    statusLoginTele: EActionStatus.Idle,
    statusLoginTwitter: EActionStatus.Idle,
    statusLoginDiscord: EActionStatus.Idle,
    errorMessage: '',
    errorCode: '',
    userInfo: serviceAuth.getUserInfoStorage(),
    userTele: serviceAuth.getUserTeleStorage(),
    userWallet: serviceAuth.getUserWalletStorage(),
    userTwitter: serviceAuth.getUserTwitterStorage(),
    userDiscord: serviceAuth.getUserDiscordStorage(),
    signature: '',
    accessToken: serviceAuth.getAccessTokenStorage(),
    refreshToken: '',
    openModalInviteBlocker: false
};

export const loginWallet = createAsyncThunk<
    ILoginResponse,
    ILoginRequest,
    {
        rejectValue: FetchError;
    }
>('auth/loginWallet', async (loginData, { rejectWithValue }) => {
    try {
        // @ts-ignore
        const loginResponse: ILoginResponse =
            await serviceAuth.loginWallet(loginData);

        const {
            user,
            tele,
            wallet,
            accessToken,
            refreshToken,
            twitter,
            discord
        } = loginResponse;

        if (loginResponse) {
        }
        if (!serviceAuth.getUserInfoStorage()) {
            serviceAuth.storeUserInfo(user as IDataUserLoginResponse);
        }
        if (!serviceAuth.getUserTeleStorage()) {
            serviceAuth.storeUserTele(tele as ILoginTeleResponse);
        }
        if (!serviceAuth.getUserTwitterStorage()) {
            serviceAuth.storeUserTwitter(twitter as ILoginTwitterResponse);
        }
        if (!serviceAuth.getUserDiscordStorage()) {
            serviceAuth.storeUserDiscord(discord as ILoginDiscordResponse);
        }
        if (!serviceAuth.getUserWalletStorage()) {
            serviceAuth.storeUserWallet(wallet as ILoginWalletResponse);
        }
        if (!serviceAuth.getAccessTokenStorage()) {
            serviceAuth.storeAccessToken(accessToken);
        }

        serviceAuth.storeRefreshToken(refreshToken);

        // save refreshToken in here

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
                state.accessToken = null;
                serviceAuth.storeAccessToken(null);
                serviceAuth.storeRefreshToken(null);
            }

            state.userTele = null;
            serviceAuth.storeUserTele(null);

            if (!serviceAuth.getUserWalletStorage()) {
                serviceAuth.storeUserInfo(null);
            }
            if (!serviceAuth.getAccessTokenStorage()) {
                serviceAuth.storeAccessToken(null);
            }
        },
        signOutWallet: (state: IAuthState) => {
            state.errorMessage = '';
            state.errorCode = '';
            state.statusLoginWallet = EActionStatus.Idle;

            // if (!state.userTele) {
            //     state.userInfo = null;
            //     state.accessToken = null;
            //     serviceAuth.storeAccessToken(null);
            //     serviceAuth.storeRefreshToken(null);
            // }
            
            state.userInfo = null;
            state.userWallet = null;
            state.userTele = null;
            state.userTwitter = null;
            state.userDiscord = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.signature = '';
           
            
            serviceAuth.storeUserInfo(null);
            serviceAuth.storeUserWallet(null);
            serviceAuth.storeUserTele(null);
            serviceAuth.storeUserTwitter(null);
            serviceAuth.storeUserDiscord(null);
            serviceAuth.storeAccessToken(null);
            serviceAuth.storeRefreshToken(null); // Clear refresh token from storage
            servicePool.storeReferId(null);


            state.statusLoginTele = EActionStatus.Idle;
            state.statusLoginTwitter = EActionStatus.Idle;
            state.statusLoginDiscord = EActionStatus.Idle;
           
            
        },




        signOutTwitter: (state: IAuthState) => {
            state.errorMessage = '';
            state.errorCode = '';
            state.statusLoginTwitter = EActionStatus.Idle;
            state.userTwitter = null;
            serviceAuth.storeUserTwitter(null);
        },
        signOutDiscord: (state: IAuthState) => {
            state.errorMessage = '';
            state.errorCode = '';
            state.statusLoginDiscord = EActionStatus.Idle;
            state.userDiscord = null;
            serviceAuth.storeUserDiscord(null);
        },

        resetStatusLoginTele: (state: IAuthState) => {
            state.statusLoginTele = EActionStatus.Idle;
        },
        resetStatusLoginWallet: (state: IAuthState) => {
            state.statusLoginWallet = EActionStatus.Idle;
        },
        resetStatusLoginTwitter: (state: IAuthState) => {
            state.statusLoginTwitter = EActionStatus.Idle;
        },
        resetStatusLoginDiscord: (state: IAuthState) => {
            state.statusLoginDiscord = EActionStatus.Idle;
        },
        updateSignature: (
            state: IAuthState,
            action: PayloadAction<ISignature>
        ) => {
            state.signature = action.payload.signature;
        },

        setOpenModalInviteBlocker: (
            state,
            action: PayloadAction<{ isOpenModalInviteBlocker: boolean }>
        ) => {
            state.openModalInviteBlocker =
                action.payload.isOpenModalInviteBlocker;
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
                if (action.payload.accessToken) {
                    state.accessToken = action.payload.accessToken;
                }
                if (action.payload.refreshToken) {
                    state.refreshToken = action.payload.refreshToken;
                }
                if (action.payload.twitter) {
                    state.userTwitter = action.payload.twitter;
                    state.statusLoginTwitter = EActionStatus.Succeeded;
                }
                if (action.payload.discord) {
                    state.userDiscord = action.payload.discord;
                    state.statusLoginDiscord = EActionStatus.Succeeded;
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
    signOutTwitter,
    signOutDiscord,
    resetStatusLoginTele,
    resetStatusLoginWallet,
    resetStatusLoginTwitter,
    resetStatusLoginDiscord,
    updateSignature,
    setOpenModalInviteBlocker
} = authSlice.actions;

export default authSlice.reducer;
