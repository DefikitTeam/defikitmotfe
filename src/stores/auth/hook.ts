import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
    loginWallet,
    resetStatusLoginTele,
    resetStatusLoginWallet,
    signOutTelegram,
    signOutWallet
} from './slice';
import { IAuthState, ILoginRequest } from './type';

type AuthLoginType = {
    authState: IAuthState;
    // eslint-disable-next-line
    // loginByTelegramAction: (loginData: IAccount) => void;
    loginAction: (loginData: ILoginRequest) => void;
    // eslint-disable-next-line
    logoutWalletAction: () => void;
    // eslint-disable-next-line
    logoutTelegramAction: () => void;
    // eslint-disable-next-line
    resetStatusLoginWalletAction: () => void;
    // eslint-disable-next-line
    resetStatusLoginTeleAction: () => void;
};

export const useAuthLogin = (): AuthLoginType => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state: RootState) => state.auth);

    const loginAction = useCallback(
        (loginData: ILoginRequest) => {
            dispatch(loginWallet(loginData));
        },
        [dispatch]
    );

    const logoutWalletAction = useCallback(() => {
        dispatch(signOutWallet());
    }, [dispatch]);
    const logoutTelegramAction = useCallback(() => {
        dispatch(signOutTelegram());
    }, [dispatch]);

    const resetStatusLoginWalletAction = useCallback(() => {
        dispatch(resetStatusLoginWallet());
    }, [dispatch]);

    const resetStatusLoginTeleAction = useCallback(() => {
        dispatch(resetStatusLoginTele());
    }, [dispatch]);

    return {
        authState,
        loginAction,
        logoutWalletAction,
        logoutTelegramAction,
        resetStatusLoginWalletAction,
        resetStatusLoginTeleAction
    };
};
