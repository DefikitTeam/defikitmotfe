import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
  resetCreateTokenData,
  updateCreateTokenInformation
} from './createSlice';
import {
  getAllTokensByOwner,
  setChoicedToken,
  setOpenModalCreateToken
} from './listSlice';
import {
  ICreateToken,
  IGetTokensByOwnerParams,
  ISettingTokenState,
  ITokenList
} from './type';

type SettingTokenType = {
  settingTokenState: ISettingTokenState;
  getListTokenByOwner: (data: IGetTokensByOwnerParams) => void;
  setOpenModdalCreateToken: (isOpenModalCreateToken: boolean) => void;
  setCurrentChoicedToken: (data: ITokenList) => void;
};
export const useListTokenOwner = (): SettingTokenType => {
  const dispatch = useAppDispatch();
  const settingTokenState = useAppSelector(
    (state: RootState) => state.tokenList
  );

  const getListTokenByOwner = useCallback(
    (data: IGetTokensByOwnerParams) => {
      dispatch(getAllTokensByOwner(data));
    },
    [dispatch]
  );

  const setOpenModdalCreateToken = useCallback(
    (isOpenModalCreateToken: boolean) => {
      dispatch(setOpenModalCreateToken({ isOpenModalCreateToken }));
    },
    [dispatch]
  );

  const setCurrentChoicedToken = useCallback(
    (choicedToken: ITokenList) => {
      dispatch(setChoicedToken({ choicedToken }));
    },
    [dispatch]
  );

  return {
    settingTokenState,
    getListTokenByOwner,
    setOpenModdalCreateToken,
    setCurrentChoicedToken
  };
};

export function useCreateTokenInformation(): [
  ICreateToken,
  (data: ICreateToken) => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.tokenCreate);
  const setCreateTokenInformation = useCallback(
    (data: ICreateToken) => {
      dispatch(updateCreateTokenInformation(data));
    },
    [dispatch]
  );

  const resetData = useCallback(() => {
    dispatch(resetCreateTokenData());
  }, [dispatch]);
  return [data, setCreateTokenInformation, resetData];
}
