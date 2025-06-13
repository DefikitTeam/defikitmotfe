import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import DistributionCaller from '../common/wagmi/DistributionCaller';
import { useConfig } from './useConfig';
import { useDistributionContract } from './useDistributionContract';

export function useDistributionCaller() {
  const { chainConfig } = useConfig();
  const chainId = chainConfig?.chainId!;

  const distributionContract = useDistributionContract(chainId);
  const distributionCaller = new DistributionCaller(distributionContract);

  // Weekly claim watchers and listeners
  const weeklyClaimForTokenWatcher = useWriteContract();
  const weeklyClaimForTokenListener = useWaitForTransactionReceipt({
    hash: weeklyClaimForTokenWatcher.data
  });

  const weeklyClaimForWalletWatcher = useWriteContract();
  const weeklyClaimForWalletListener = useWaitForTransactionReceipt({
    hash: weeklyClaimForWalletWatcher.data
  });

  // Monthly claim watchers and listeners
  const monthlyClaimForTokenWatcher = useWriteContract();
  const monthlyClaimForTokenListener = useWaitForTransactionReceipt({
    hash: monthlyClaimForTokenWatcher.data
  });

  const monthlyClaimForWalletWatcher = useWriteContract();
  const monthlyClaimForWalletListener = useWaitForTransactionReceipt({
    hash: monthlyClaimForWalletWatcher.data
  });

  // Quarterly claim watchers and listeners
  const quarterlyClaimForTokenWatcher = useWriteContract();
  const quarterlyClaimForTokenListener = useWaitForTransactionReceipt({
    hash: quarterlyClaimForTokenWatcher.data
  });

  const quarterlyClaimForWalletWatcher = useWriteContract();
  const quarterlyClaimForWalletListener = useWaitForTransactionReceipt({
    hash: quarterlyClaimForWalletWatcher.data
  });

  // Yearly claim watchers and listeners
  const yearlyClaimForTokenWatcher = useWriteContract();
  const yearlyClaimForTokenListener = useWaitForTransactionReceipt({
    hash: yearlyClaimForTokenWatcher.data
  });

  const yearlyClaimForWalletWatcher = useWriteContract();
  const yearlyClaimForWalletListener = useWaitForTransactionReceipt({
    hash: yearlyClaimForWalletWatcher.data
  });

  return {
    useWeeklyClaimForToken: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        token: string;
        proof: string[];
      }) => {
        return distributionCaller.claimWeeklyRetroActiveForToken(
          weeklyClaimForTokenWatcher,
          params
        );
      },
      isConfirmed: weeklyClaimForTokenListener.isSuccess,
      isLoadingAgreed: weeklyClaimForTokenListener.isLoading,
      isLoadingInit: weeklyClaimForTokenWatcher.isPending,
      isError: weeklyClaimForTokenListener.isError || weeklyClaimForTokenWatcher.isError
    },

    useWeeklyClaimForWallet: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        proof: string[];
      }) => {
        return distributionCaller.claimWeeklyRetroActiveForWallet(
          weeklyClaimForWalletWatcher,
          params
        );
      },
      isConfirmed: weeklyClaimForWalletListener.isSuccess,
      isLoadingAgreed: weeklyClaimForWalletListener.isLoading,
      isLoadingInit: weeklyClaimForWalletWatcher.isPending,
      isError: weeklyClaimForWalletListener.isError || weeklyClaimForWalletWatcher.isError
    },

    useMonthlyClaimForToken: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        token: string;
        proof: string[];
      }) => {
        return distributionCaller.claimMonthlyRetroActiveForToken(
          monthlyClaimForTokenWatcher,
          params
        );
      },
      isConfirmed: monthlyClaimForTokenListener.isSuccess,
      isLoadingAgreed: monthlyClaimForTokenListener.isLoading,
      isLoadingInit: monthlyClaimForTokenWatcher.isPending,
      isError: monthlyClaimForTokenListener.isError || monthlyClaimForTokenWatcher.isError
    },

    useMonthlyClaimForWallet: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        proof: string[];
      }) => {
        return distributionCaller.claimMonthlyRetroActiveForWallet(
          monthlyClaimForWalletWatcher,
          params
        );
      },
      isConfirmed: monthlyClaimForWalletListener.isSuccess,
      isLoadingAgreed: monthlyClaimForWalletListener.isLoading,
      isLoadingInit: monthlyClaimForWalletWatcher.isPending,
      isError: monthlyClaimForWalletListener.isError || monthlyClaimForWalletWatcher.isError
    },

    useQuarterlyClaimForToken: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        token: string;
        proof: string[];
      }) => {
        return distributionCaller.claimQuarterlyRetroActiveForToken(
          quarterlyClaimForTokenWatcher,
          params
        );
      },
      isConfirmed: quarterlyClaimForTokenListener.isSuccess,
      isLoadingAgreed: quarterlyClaimForTokenListener.isLoading,
      isLoadingInit: quarterlyClaimForTokenWatcher.isPending,
      isError: quarterlyClaimForTokenListener.isError || quarterlyClaimForTokenWatcher.isError
    },

    useQuarterlyClaimForWallet: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        proof: string[];
      }) => {
        return distributionCaller.claimQuarterlyRetroActiveForWallet(
          quarterlyClaimForWalletWatcher,
          params
        );
      },
      isConfirmed: quarterlyClaimForWalletListener.isSuccess,
      isLoadingAgreed: quarterlyClaimForWalletListener.isLoading,
      isLoadingInit: quarterlyClaimForWalletWatcher.isPending,
      isError: quarterlyClaimForWalletListener.isError || quarterlyClaimForWalletWatcher.isError
    },

    useYearlyClaimForToken: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        token: string;
        proof: string[];
      }) => {
        return distributionCaller.claimYearlyRetroActiveForToken(
          yearlyClaimForTokenWatcher,
          params
        );
      },
      isConfirmed: yearlyClaimForTokenListener.isSuccess,
      isLoadingAgreed: yearlyClaimForTokenListener.isLoading,
      isLoadingInit: yearlyClaimForTokenWatcher.isPending,
      isError: yearlyClaimForTokenListener.isError || yearlyClaimForTokenWatcher.isError
    },

    useYearlyClaimForWallet: {
      actionAsync: (params: {
        timestamp: string;
        amount: string;
        proof: string[];
      }) => {
        return distributionCaller.claimYearlyRetroActiveForWallet(
          yearlyClaimForWalletWatcher,
          params
        );
      },
      isConfirmed: yearlyClaimForWalletListener.isSuccess,
      isLoadingAgreed: yearlyClaimForWalletListener.isLoading,
      isLoadingInit: yearlyClaimForWalletWatcher.isPending,
      isError: yearlyClaimForWalletListener.isError || yearlyClaimForWalletWatcher.isError
    }
  };
} 