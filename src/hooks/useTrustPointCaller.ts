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
        }
    };
}
