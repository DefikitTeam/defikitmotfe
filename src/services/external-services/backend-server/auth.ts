/* eslint-disable */
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD,
    NEXT_PUBLIC_ENVIRONMENT
} from '@/src/common/web3/constants/env';
import {
    ICheckAccessTokenResponse,
    IDataUserLoginResponse,
    ILoginRequest,
    ILoginTeleResponse,
    ILoginWalletResponse
} from '@/src/stores/auth/type';
import { IRefCode } from '@/src/stores/pool/type';
import { Cookies } from 'react-cookie';
import { post } from '../fetcher';
import { ConfigService } from '@/src/config/services/config-service';
const cookies = new Cookies();
const USER_INFO_STORAGE_KEY = 'usr_if';
const USER_WALLET_STORAGE_KEY = 'usr_wallet_if';
const USER_TELE_STORAGE_KEY = 'usr_tele_if';
export const REFCODE_INFO_STORAGE_KEY = 'refCode';
const USER_TOKEN_STORAGE_KEY = 'usr_tk';

const USER_REFRESH_TOKEN_STORAGE_KEY = 'usr_refresh_token';

const config = ConfigService.getInstance();

const serviceAuth = {
    loginWallet: async (payload: ILoginRequest) => {
        const response = await post<any>(
            `${config.getApiConfig().baseUrl}/auth/login`,
            payload
        );
        return response;
    },
    storeUserInfo: (user: IDataUserLoginResponse | null) => {
        if (user) {
            cookies.set(USER_INFO_STORAGE_KEY, JSON.stringify(user), {
                path: '/'
            });
            return;
        }
        cookies.remove(USER_INFO_STORAGE_KEY, { path: '/' });
    },
    storeUserWallet: (wallet: ILoginWalletResponse | null) => {
        if (wallet) {
            cookies.set(USER_WALLET_STORAGE_KEY, JSON.stringify(wallet), {
                path: '/'
            });
            return;
        }
        cookies.remove(USER_WALLET_STORAGE_KEY, { path: '/' });
    },
    storeUserTele: (tele: ILoginTeleResponse | null) => {
        if (tele) {
            cookies.set(USER_TELE_STORAGE_KEY, JSON.stringify(tele), {
                path: '/'
            });
            return;
        }
        cookies.remove(USER_TELE_STORAGE_KEY, { path: '/' });
    },
    getUserInfoStorage: (): IDataUserLoginResponse | null => {
        const userInfo = cookies.get(USER_INFO_STORAGE_KEY);
        return userInfo ? userInfo : null;
    },
    getUserWalletStorage: (): ILoginWalletResponse | null => {
        const walletInfo = cookies.get(USER_WALLET_STORAGE_KEY);
        return walletInfo ? walletInfo : null;
    },
    getUserTeleStorage: (): ILoginTeleResponse | null => {
        const teleInfo = cookies.get(USER_TELE_STORAGE_KEY);
        return teleInfo ? teleInfo : null;
    },

    storeAccessToken: (token: string | null) => {
        if (token) {
            cookies.set(USER_TOKEN_STORAGE_KEY, JSON.stringify(token), {
                path: '/'
            });
            return;
        }
        cookies.remove(USER_TOKEN_STORAGE_KEY, { path: '/' });
    },

    storeRefreshToken: (token: string | null) => {
        if (token) {
            cookies.set(USER_REFRESH_TOKEN_STORAGE_KEY, JSON.stringify(token), {
                path: '/'
            });
            return;
        }
        cookies.remove(USER_REFRESH_TOKEN_STORAGE_KEY, { path: '/' });
    },
    getAccessTokenStorage: (): string | null => {
        const tokenString = cookies.get(USER_TOKEN_STORAGE_KEY);
        return tokenString ? tokenString : null;
    },

    getRefreshToken: async () => {
        const refreshToken = cookies.get(USER_REFRESH_TOKEN_STORAGE_KEY);
        const response = await post<{
            accessToken: string;
        }>('/refresh-access-token', { refreshToken: refreshToken });
        const accessToken = response.data;
        if (accessToken) {
            cookies.set(USER_TOKEN_STORAGE_KEY, JSON.stringify(accessToken), {
                path: '/'
            });
        }
        return accessToken;
    },

    getRefCode: (): IRefCode | null => {
        if (typeof window !== 'undefined') {
            const refer = localStorage.getItem(REFCODE_INFO_STORAGE_KEY);

            return refer ? (JSON.parse(refer) as IRefCode) : null;
        }
        return null;
    },
    storeRefCode: (refCode: IRefCode) => {
        if (typeof window !== 'undefined') {
            const existingRefCode = localStorage.getItem(
                REFCODE_INFO_STORAGE_KEY
            );

            if (!existingRefCode) {
                localStorage.setItem(
                    REFCODE_INFO_STORAGE_KEY,
                    JSON.stringify(refCode)
                );
            } else {
                console.log('refCode đã tồn tại:', existingRefCode);
            }
        }
    },
    checkAccessToken: async () => {
        let res;

        res = await post<ICheckAccessTokenResponse>(
            `${config.getApiConfig().baseUrl}/auth/check-access-token`
        );

        return res;
    }
};

export default serviceAuth;
