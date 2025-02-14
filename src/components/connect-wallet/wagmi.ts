/* eslint-disable */
import { getEnvironment } from '@/src/common/constant/constance';
import { NEXT_PUBLIC_PROJECT_ID } from '@/src/common/web3/constants/env';
import { CHAIN_CONFIG } from '@/src/config/environments/chains';
import { Environment } from '@/src/config/type';
import '@hot-wallet/sdk/adapter/evm';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

import { iota } from 'viem/chains';

const iotaWithIcon: Chain = {
    ...iota,
    iconUrl: 'https://cryptologos.cc/logos/iota-miota-logo.png',
    iconBackground: '#ffffff'
};

const environment = getEnvironment();

export const getChainConfig = (environment: Environment) => {
    return CHAIN_CONFIG[environment] || CHAIN_CONFIG.development;
};

export const config = getDefaultConfig({
    appName: 'Rocket Launch',
    projectId: NEXT_PUBLIC_PROJECT_ID ?? '',
    appIcon: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
    // @ts-ignore
    chains: [...getChainConfig(environment).supportedChains],
    defaultChain: getChainConfig(environment).defaultChain,
    autoConnect: false
    // wallets: [
    //     hotWallet,
    // ],
    // ssr: true
});
