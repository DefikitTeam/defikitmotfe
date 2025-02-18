import { getEnvironment } from '@/src/common/constant/constance';
import { CHAIN_CONFIG } from '@/src/config/environments/chains';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChainInfor {
    chainId: number;
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    // onFaucet: boolean;
}

interface ChainDataState {
    chainData: IChainInfor;
}

const getInitialChainData = () => {
    const environment = getEnvironment();

    const kien: any = {
        chainId: CHAIN_CONFIG[environment].defaultChain.id,
        name: CHAIN_CONFIG[environment].defaultChain.name,
        currency: CHAIN_CONFIG[environment].defaultChain.nativeCurrency.symbol,
        explorerUrl:
            CHAIN_CONFIG[environment].defaultChain.blockExplorers.default.url,
        rpcUrl: CHAIN_CONFIG[environment].defaultChain.rpcUrls.default.http[0]
    };

    return {
        chainId: CHAIN_CONFIG[environment].defaultChain.id,
        name: CHAIN_CONFIG[environment].defaultChain.name,
        currency: CHAIN_CONFIG[environment].defaultChain.nativeCurrency.symbol,
        explorerUrl:
            CHAIN_CONFIG[environment].defaultChain.blockExplorers.default.url,
        rpcUrl: CHAIN_CONFIG[environment].defaultChain.rpcUrls.default.http[0]
    };
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
