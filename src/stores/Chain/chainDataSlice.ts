import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chains } from '@/src/common/constant/constance';
import { NEXT_PUBLIC_DOMAIN_BARTIO_STG } from '@/src/common/web3/constants/env';

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
    const isStaging =
        typeof window !== 'undefined' &&
        window.location.hostname === NEXT_PUBLIC_DOMAIN_BARTIO_STG;
    return isStaging ? chains[1] : chains[0];
};

const initialState: ChainDataState = {
    chainData: getInitialChainData()
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
