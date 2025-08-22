/* eslint-disable */
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

// Get projectId directly from environment
const getProjectId = () => {
  // For client-side, use the bundled env var
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PROJECT_ID;
  }
  // For server-side, check both sources
  return process.env.NEXT_PUBLIC_PROJECT_ID;
};

const projectId = getProjectId() || '3d32cdc56217aac378e096e4c69357a9';

console.log('WalletConnect projectId:', projectId);

if (!projectId) {
  console.error('WalletConnect projectId is required. Please set NEXT_PUBLIC_PROJECT_ID in your environment variables.');
  throw new Error('WalletConnect projectId is required');
}

export const config = getDefaultConfig({
  appName: 'Rocket Launch',
  projectId: projectId,
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
