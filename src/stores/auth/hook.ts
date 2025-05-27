import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
  loginWallet,
  resetStatusLoginTele,
  resetStatusLoginWallet,
  setOpenModalInviteBlocker,
  signOutDiscord,
  signOutTwitter,
  signOutTelegram,
  signOutWallet,
  resetStatusLoginTwitter,
  resetStatusLoginDiscord
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
  logoutTwitterAction: () => void;
  // eslint-disable-next-line
  logoutDiscordAction: () => void;
  // eslint-disable-next-line
  logoutTelegramAction: () => void;
  // eslint-disable-next-line
  resetStatusLoginWalletAction: () => void;
  // eslint-disable-next-line
  resetStatusLoginTeleAction: () => void;

  resetStatusLoginTwitterAction: () => void;
  // eslint-disable-next-line
  resetStatusLoginDiscordAction: () => void;
  // eslint-disable-next-line
  setOpenModalInviteBlocker: (isOpenModalInviteBlocker: boolean) => void;
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

  const setOpenModalInviteBlockerAction = useCallback(
    (isOpenModalInviteBlocker: boolean) => {
      dispatch(setOpenModalInviteBlocker({ isOpenModalInviteBlocker }));
    },
    [dispatch]
  );

  const logoutTwitterAction = useCallback(() => {
    dispatch(signOutTwitter());
  }, [dispatch]);

  const logoutDiscordAction = useCallback(() => {
    dispatch(signOutDiscord());
  }, [dispatch]);

  const resetStatusLoginTwitterAction = useCallback(() => {
    dispatch(resetStatusLoginTwitter());
  }, [dispatch]);

  const resetStatusLoginDiscordAction = useCallback(() => {
    dispatch(resetStatusLoginDiscord());
  }, [dispatch]);

  return {
    authState,
    loginAction,
    logoutWalletAction,
    logoutTelegramAction,
    resetStatusLoginWalletAction,
    resetStatusLoginTeleAction,
    setOpenModalInviteBlocker: setOpenModalInviteBlockerAction,
    logoutTwitterAction,
    logoutDiscordAction,
    resetStatusLoginTwitterAction,
    resetStatusLoginDiscordAction
  };
};
