import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { getTrustPointContract } from '../common/blockchain/evm/contracts/utils/getTrustPointContract';
import MultiCaller from '../common/wagmi/MultiCaller';
import { useConfig } from './useConfig';

export function useTrustPointCaller() {
    const { chainConfig } = useConfig();

    const trustPointContract = getTrustPointContract(chainConfig?.chainId!);
    const trustPointCaller = new MultiCaller(trustPointContract);

    const mintWithSignatureWatcher = useWriteContract();
    const mintWithSignatureListener = useWaitForTransactionReceipt({
        hash: mintWithSignatureWatcher.data
    });

    const mintTokenWithSignatureWatcher = useWriteContract();
    const mintTokenWithSignatureListener = useWaitForTransactionReceipt({
        hash: mintTokenWithSignatureWatcher.data
    });

    return {
        useMintWithSignature: {
            actionAsync: (params: {
                id: string;
                signature: string | number;
            }) => {
                return trustPointCaller.mintWithSignature(
                    mintWithSignatureWatcher,
                    params
                );
            },
            isConfirmed: mintWithSignatureListener.isSuccess,
            isLoadingAgreedMintWithSignature:
                mintWithSignatureListener.isLoading,
            isLoadingInitMintWithSignature: mintWithSignatureWatcher.isPending,
            isError:
                mintWithSignatureListener.isError ||
                mintWithSignatureWatcher.isError
        },

        useMintTokenWithSignature: {
            actionAsync: (params: {
                id: string;
                token: string;
                signature: string | number;
            }) => {
                return trustPointCaller.mintTokenWithSignature(
                    mintTokenWithSignatureWatcher,
                    params
                );
            },
            isConfirmed: mintTokenWithSignatureListener.isSuccess,
            isLoadingAgreedMintTokenWithSignature:
                mintTokenWithSignatureListener.isLoading,
            isLoadingInitMintTokenWithSignature:
                mintTokenWithSignatureWatcher.isPending,
            isError:
                mintTokenWithSignatureListener.isError ||
                mintTokenWithSignatureWatcher.isError
        }
    };
}
