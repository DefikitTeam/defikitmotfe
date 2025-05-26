/* eslint-disable */
import { NEXT_PUBLIC_PROJECT_ID } from '@/src/common/web3/constants/env';
import { ConfigService } from '@/src/config/services/config-service';
import '@hot-wallet/sdk/adapter/evm';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

import { iota } from 'viem/chains';

const iotaWithIcon: Chain = {
  ...iota,
  iconUrl: 'https://cryptologos.cc/logos/iota-miota-logo.png',
  iconBackground: '#ffffff'
};

const configService = ConfigService.getInstance();

export const config = getDefaultConfig({
  appName: 'Rocket Launch',
  projectId: NEXT_PUBLIC_PROJECT_ID ?? '',
  appIcon: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
  // @ts-ignore
  chains: [...configService.getSupportedChainsNew()],
  defaultChain: configService.getDefaultChainNew(),
  autoConnect: false
  // wallets: [
  //     hotWallet,
  // ],
  // ssr: true
});
