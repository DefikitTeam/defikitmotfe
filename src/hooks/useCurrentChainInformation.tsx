/* eslint-disable */
// 'use client';

import { useAccount } from 'wagmi';
import { chains } from '../common/constant/constance';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RootState } from '../stores';
import { useDispatch, useSelector } from 'react-redux';
import { setChainData } from '../stores/Chain/chainDataSlice';
import { useNotification } from './use-notification';
import { useSwitchChain } from 'wagmi';

export interface IChainInfor {
    chainId: number;
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    onFaucet: boolean;
}

const useCurrentChainInformation = () => {
    const { chain, chainId } = useAccount();
    const dispatch = useDispatch();
    const chainData = useSelector(
        (state: RootState) => state.chainData.chainData
    );
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const refId = searchParams?.get('refId');
    const currentPath = pathname?.split('/');
    const { switchChain } = useSwitchChain();

    const getCurrentChainUrl = (): IChainInfor | undefined => {
        return chains.find(
            (item) =>
                item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
        );
    };

    useEffect(() => {
        if (chainId && chain) {
            let chainDataResult: IChainInfor = {
                chainId: chain.id ?? chainData?.chainId,
                name: chain.name ?? chainData?.name,
                currency: chain.nativeCurrency?.symbol ?? chainData?.currency,
                explorerUrl:
                    chain.blockExplorers?.default.url ?? chainData?.explorerUrl,
                rpcUrl: chain?.rpcUrls.default.http[0] ?? '',
                onFaucet:
                    chains.find((item) => item.chainId === chain.id)
                        ?.onFaucet ?? false
            };
            if (refId) {
                const chainInfo = getCurrentChainUrl();
                if (chainInfo) {
                    dispatch(setChainData(chainInfo));
                    switchChain({ chainId: chainInfo.chainId });
                }
                router.push(`${currentPath?.join('/')}?refId=${refId}`);
            } else if (
                currentPath &&
                currentPath[2] !==
                    chainDataResult.name.replace(/\s+/g, '').toLowerCase()
            ) {
                dispatch(setChainData(chainDataResult));
                router.push(
                    `/${chainDataResult.name.replace(/\s+/g, '').toLowerCase()}`
                );
            }
        }
    }, [chainId, chain]);

    return { chainData };
};
export default useCurrentChainInformation;
