import { chains } from '@/src/common/constant/constance';
import {
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG
} from '@/src/common/web3/constants/env';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChainInfor {
    chainId: number;
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    onFaucet: boolean;
}

interface ChainDataState {
    chainData: IChainInfor;
}

const getInitialChainData = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const chainMappings: Record<string, IChainInfor> = {
        [`${NEXT_PUBLIC_DOMAIN_BARTIO_STG}`]: chains[1],
        [`${NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD}`]: chains[7],
        [`${NEXT_PUBLIC_DOMAIN_MULTIPLE_STG}`]: chains[1]
    };

    // console.log('chainMappings[window.location.hostname]-----', chainMappings[window.location.hostname] )
    return chainMappings[window.location.hostname];
};

const initialState: ChainDataState = {
    chainData: getInitialChainData()!
};

const chainDataSlice = createSlice({
    name: 'chainData',
    initialState,
    reducers: {
        setChainData: (state, action: PayloadAction<IChainInfor>) => {
            state.chainData = action.payload;
        }
    }
});

export const { setChainData } = chainDataSlice.actions;
export default chainDataSlice.reducer;
