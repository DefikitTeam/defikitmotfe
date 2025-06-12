/* eslint-disable */
import {
  PoolStatus,
  PoolStatusSortFilter,
  PoolStatusSortOrderBy
} from '@/src/common/constant/constance';
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import { getAllRankPools, getAllRankWallet } from '../detailSlice';
import {
  getAllPoolBackgroundByType,
  getAllPoolByType,
  getPoolMetadata,
  setFilter,
  setOrderByDirectionFilter,
  setOrderByFilter,
  updateCalculatePool
} from '../listSlice';
import {
  IGetAllPoolBackgroundQuery,
  IGetAllPoolQuery,
  IGetAllRankPoolsParams,
  IGetAllRankWalletParams,
  IGetMetadataPoolParams,
  IPoolState,
  IUpdateCalculatePoolParams
} from '../type';

type ListPooltype = {
  poolStateList: IPoolState;

  getListPoolAction: (data: IGetAllPoolQuery) => void;
  getListPoolBackgroundAction: (data: IGetAllPoolBackgroundQuery) => void;

  updateCalculatePoolAction: (data: IUpdateCalculatePoolParams) => void;
  getMetadataPoolVisibleAction: (data: IGetMetadataPoolParams) => void;

  setFilterAction: (data: PoolStatus) => void;

  setOrderByDirectionAction: (data: PoolStatusSortFilter) => void;
  setOrderByAction: (data: PoolStatusSortOrderBy) => void;

  getAllRankPoolsAction: (data: IGetAllRankPoolsParams) => void;
  getAllRankWalletAction: (data: IGetAllRankWalletParams) => void;
};

export const useListPool = (): ListPooltype => {
  const dispatch = useAppDispatch();
  const poolStateList = useAppSelector((state: RootState) => state.poolList);

  const getListPoolAction = useCallback(
    (data: IGetAllPoolQuery) => {
      dispatch(getAllPoolByType(data));
    },
    [dispatch]
  );

  const getListPoolBackgroundAction = useCallback(
    (data: IGetAllPoolBackgroundQuery) => {
      dispatch(getAllPoolBackgroundByType(data));
    },
    [dispatch]
  );

  const updateCalculatePoolAction = useCallback(
    (data: IUpdateCalculatePoolParams) => {
      dispatch(updateCalculatePool(data));
    },
    [dispatch]
  );

  const getMetadataPoolVisibleAction = useCallback(
    (data: IGetMetadataPoolParams) => {
      dispatch(getPoolMetadata(data));
    },
    [dispatch]
  );

  const setFilterAction = useCallback(
    (data: PoolStatus) => {
      dispatch(setFilter(data));
    },
    [dispatch]
  );

  const setOrderByDirectionAction = useCallback(
    (data: PoolStatusSortFilter) => {
      dispatch(setOrderByDirectionFilter(data));
    },
    [dispatch]
  );

  const setOrderByAction = useCallback(
    (data: PoolStatusSortOrderBy) => {
      dispatch(setOrderByFilter(data));
    },
    [dispatch]
  );

  const getAllRankPoolsAction = useCallback(
    (data: IGetAllRankPoolsParams) => {
      dispatch(getAllRankPools(data));
    },
    [dispatch]
  );

  const getAllRankWalletAction = useCallback(
    (data: IGetAllRankWalletParams) => {
      dispatch(getAllRankWallet(data));
    },
    [dispatch]
  );

  return {
    poolStateList,
    getListPoolAction,
    getListPoolBackgroundAction,
    updateCalculatePoolAction,
    getMetadataPoolVisibleAction,
    setFilterAction,
    setOrderByDirectionAction,
    setOrderByAction,
    getAllRankPoolsAction,
    getAllRankWalletAction
  };
};
