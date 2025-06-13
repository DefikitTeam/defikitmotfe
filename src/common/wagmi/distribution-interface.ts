import { config } from '@/src/components/connect-wallet/wagmi';
import { ConfigService } from '@/src/config/services/config-service';
import { getGasPrice } from '@wagmi/core';
import { message } from 'antd';
import { JointContent } from 'antd/lib/message/interface';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Abi, BaseError, ContractFunctionRevertedError } from 'viem';
import { UseWriteContractReturnType } from 'wagmi';
import { ChainId } from '../constant/constance';
import { ContractInfo } from './launch-pad-interface';


export class DistributionInterface {
  _contractStruct: ContractInfo;
  constructor(contractStruct: ContractInfo) {
    this._contractStruct = contractStruct;
  }

  handleErrors(err: any) {
    if (err instanceof BaseError) {
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorMessages = revertError.data?.args ?? [''];
        {
          errorMessages.map((error) => message.error(error as JointContent));
        }
      } else {
        return message.error(err?.shortMessage || err?.message || 'Error');
      }
    } else {
      return message.error(err?.shortMessage || err?.message || 'Error');
    }
  }

  async claimWeeklyRetroActiveForToken(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      token: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, token, proof } = params;
      if (!timestamp || !amount || !token || !proof) {
        throw new Error('Invalid params when call claimWeeklyRetroActiveForToken');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimWeeklyRetroActiveForToken',
        args: [timestamp, amount, token, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimWeeklyRetroActiveForWallet(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, proof } = params;
      if (!timestamp || !amount || !proof) {
        throw new Error('Invalid params when call claimWeeklyRetroActiveForWallet');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimWeeklyRetroActive',
        args: [timestamp, amount, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimMonthlyRetroActiveForToken(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      token: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, token, proof } = params;
      if (!timestamp || !amount || !token || !proof) {
        throw new Error('Invalid params when call claimMonthlyRetroActiveForToken');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimMonthlyRetroActiveForToken',
        args: [timestamp, amount, token, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimMonthlyRetroActiveForWallet(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, proof } = params;
      if (!timestamp || !amount || !proof) {
        throw new Error('Invalid params when call claimMonthlyRetroActiveForWallet');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimMonthlyRetroActive',
        args: [timestamp, amount, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimQuarterlyRetroActiveForToken(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      token: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, token, proof } = params;
      if (!timestamp || !amount || !token || !proof) {
        throw new Error('Invalid params when call claimQuarterlyRetroActiveForToken');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimQuarterlyRetroActiveForToken',
        args: [timestamp, amount, token, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimQuarterlyRetroActiveForWallet(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, proof } = params;
      if (!timestamp || !amount || !proof) {
        throw new Error('Invalid params when call claimQuarterlyRetroActiveForWallet');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimQuarterlyRetroActive',
        args: [timestamp, amount, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimYearlyRetroActiveForToken(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      token: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, token, proof } = params;
      if (!timestamp || !amount || !token || !proof) {
        throw new Error('Invalid params when call claimYearlyRetroActiveForToken');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimYearlyRetroActiveForToken',
        args: [timestamp, amount, token, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async claimYearlyRetroActiveForWallet(
    watcher: UseWriteContractReturnType,
    params: {
      timestamp: string;
      amount: string;
      proof: string[];
    }
  ) {
    try {
      const { timestamp, amount, proof } = params;
      if (!timestamp || !amount || !proof) {
        throw new Error('Invalid params when call claimYearlyRetroActiveForWallet');
      }

      await watcher.writeContractAsync({
        ...this._contractStruct,
        functionName: 'claimYearlyRetroActive',
        args: [timestamp, amount, proof]
      });
    } catch (err) {
      this.handleErrors(err);
    }
  }
}
