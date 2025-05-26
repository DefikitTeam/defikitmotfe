import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
  resetSellTokenInformation,
  updateSellTokenInformation
} from './sellTokenSlice';
import {
  getProfile,
  getRecentTx,
  getYourFriendList,
  setIdChooseTokenSell,
  setOpenModalYourFriendList,
  setPageRecentTx
} from './slice';
import {
  IGetPortfolioParams,
  IGetRecentTxParams,
  IGetYourFriendListParams,
  IPortfolioState,
  ISellToken
} from './type';

export function usePortfolio(): [
  {
    portfolio: IPortfolioState;
  },
  (data: IGetPortfolioParams) => void,
  setIdCurrentChoosedTokenSell: (id: string) => void,
  (data: IGetYourFriendListParams) => void,

  setOpenModalYourFriendListAction: (
    isOpenModalYourFriendList: boolean
  ) => void,
  (data: IGetRecentTxParams) => void,
  (data: number) => void
] {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state: RootState) => state.portfolio);

  const fetchPortfolio = useCallback(
    (data: IGetPortfolioParams) => {
      dispatch(getProfile(data));
    },
    [dispatch]
  );

  const setIdCurrentChoosedTokenSell = useCallback(
    (id: string) => {
      dispatch(setIdChooseTokenSell({ id }));
    },
    [dispatch]
  );
  const fetchYourListFriendAction = useCallback(
    (data: IGetYourFriendListParams) => {
      dispatch(getYourFriendList(data));
    },
    [dispatch]
  );
  const setOpenModalYourFriendListAction = useCallback(
    (isOpenModalYourFriendList: boolean) => {
      dispatch(setOpenModalYourFriendList({ isOpenModalYourFriendList }));
    },
    [dispatch]
  );
  const fetchRecentTxAction = useCallback(
    (data: IGetRecentTxParams) => {
      dispatch(getRecentTx(data));
    },
    [dispatch]
  );
  const setPageRecentTxAction = useCallback(
    (page: number) => {
      dispatch(setPageRecentTx({ page }));
    },
    [dispatch]
  );

  return [
    {
      portfolio
    },
    fetchPortfolio,
    setIdCurrentChoosedTokenSell,
    fetchYourListFriendAction,
    setOpenModalYourFriendListAction,
    fetchRecentTxAction,
    setPageRecentTxAction
  ];
}

export function useSellTokenInformation(): [
  ISellToken,
  (data: ISellToken) => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.tokenSell);
  const setSellTokenInformation = useCallback(
    (data: ISellToken) => {
      dispatch(updateSellTokenInformation(data));
    },
    [dispatch]
  );
  const resetData = useCallback(() => {
    dispatch(resetSellTokenInformation());
  }, [dispatch]);

  return [data, setSellTokenInformation, resetData];
}
