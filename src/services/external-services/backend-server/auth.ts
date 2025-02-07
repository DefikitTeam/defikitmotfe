/* eslint-disable */
import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';
import {
    IDataUserLoginResponse,
    ILoginRequest,
    ILoginTeleResponse,
    ILoginWalletResponse
} from '@/src/stores/auth/type';
import { Cookies } from 'react-cookie';
import { post } from '../fetcher';
const cookies = new Cookies();
const USER_INFO_STORAGE_KEY = 'usr_if';
const USER_WALLET_STORAGE_KEY = 'usr_wallet_if';
const USER_TELE_STORAGE_KEY = 'usr_tele_if';

const serviceAuth = {
    loginWallet: async (payload: ILoginRequest) => {
        const response = await post<any>(
            `${NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
            payload
        );
        return response.data;
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
    }
};

export default serviceAuth;
