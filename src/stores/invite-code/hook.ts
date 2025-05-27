import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { IGetAllQuery } from '../pool/type';
import {
  getInviteCode,
  resetGetInviteCodeRefer,
  setIsOpenModalGetListCurrentCode
} from './get-invite-code';
import {
  getInviteListRefer,
  resetInviteListRefer,
  setOpenModalInviteListRefer
} from './list-refer-slice';
import { IGetInviteCodeState, IInviteListRefer } from './type';

export function useInviteListReferPortfolio(): [
  {
    inviteListRefer: IInviteListRefer;
  },
  getInviteListRefer: (data: IGetAllQuery) => void,
  setOpenModalInviteListReferAction: (
    isOpenModalInviteListRefer: boolean
  ) => void,
  resetInviteListReferAction: () => void
] {
  const dispatch = useAppDispatch();
  const inviteListRefer = useAppSelector(
    (state: RootState) => state.inviteListRefer
  );

  const fetchInviteListRefer = useCallback(
    (data: IGetAllQuery) => {
      dispatch(getInviteListRefer(data));
    },
    [dispatch]
  );

  const setOpenModalInviteListReferAction = useCallback(
    (isOpenModalInviteListRefer: boolean) => {
      dispatch(setOpenModalInviteListRefer({ isOpenModalInviteListRefer }));
    },
    [dispatch]
  );

  const resetInviteListReferAction = useCallback(() => {
    dispatch(resetInviteListRefer());
  }, [dispatch]);

  return [
    { inviteListRefer },
    fetchInviteListRefer,
    setOpenModalInviteListReferAction,
    resetInviteListReferAction
  ];
}

export function useGetInviteCode(): [
  {
    inviteCode: IGetInviteCodeState;
  },
  fetchGetInviteCode: () => void,
  resetGetInviteCode: () => void,
  setIsOpenModalGetListCurrentCodeAction: (
    isOpenModalGetListCurrentCode: boolean
  ) => void
] {
  const dispatch = useAppDispatch();
  const inviteCode = useAppSelector((state: RootState) => state.getInviteCode);

  const fetchGetInviteCode = useCallback(() => {
    dispatch(getInviteCode());
  }, [dispatch]);

  const resetGetInviteCode = useCallback(() => {
    dispatch(resetGetInviteCodeRefer());
  }, [dispatch]);

  const setIsOpenModalGetListCurrentCodeAction = useCallback(
    (isOpenModalGetListCurrentCode: boolean) => {
      dispatch(
        setIsOpenModalGetListCurrentCode({
          isOpenModalGetListCurrentCode
        })
      );
    },
    [dispatch]
  );

  return [
    {
      inviteCode
    },
    fetchGetInviteCode,
    resetGetInviteCode,
    setIsOpenModalGetListCurrentCodeAction
  ];
}
