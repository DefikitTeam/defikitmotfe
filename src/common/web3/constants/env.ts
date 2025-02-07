/* eslint-disable */
import * as process from 'process';
import { arbitrum } from 'viem/chains';
import { z } from 'zod';
export const NEXT_PUBLIC_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

export const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS;

export const NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD =
    process.env.NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD;

export const NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS;

export const NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS_PROD =
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS_PROD;

export const NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS;
export const NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS;
export const NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS;

export const NEXT_PUBLIC_BASE_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS;

export const NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD =
    process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD;

export const NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS;

export const NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD =
    process.env.NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD;

export const NEXT_PUBLIC_DOMAIN_BARTIO_STG =
    process.env.NEXT_PUBLIC_DOMAIN_BARTIO_STG;

export const NEXT_PUBLIC_DOMAIN_MULTIPLE_STG =
    process.env.NEXT_PUBLIC_DOMAIN_MULTIPLE_STG;

export const NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD =
    process.env.NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD;

export const NEXT_PUBLIC_API_ENDPOINT_PROD =
    process.env.NEXT_PUBLIC_API_ENDPOINT_PROD;

export const NEXT_PUBLIC_IS_FAUCET = process.env.NEXT_PUBLIC_IS_FAUCET;

export const LOG_LEVEL_SCHEMA = z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .default('info');

export const LOG_LEVEL = LOG_LEVEL_SCHEMA.parse(
    process.env.LOG_LEVEL ?? 'info'
);

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

export const getConfigs = (hostname: string) => {
    const apiEndpoint =
        hostname === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD
            ? NEXT_PUBLIC_API_ENDPOINT_PROD
            : NEXT_PUBLIC_API_ENDPOINT;

    const isProd = hostname === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD;

    return {
        subgraph: {
            bartio: {
                uri: `${apiEndpoint}/subgraph/berachain`
            },
            baseSepolia: {
                uri: `${apiEndpoint}/subgraph/base-sepolia`
            },
            polygonAmoy: {
                uri: `${apiEndpoint}/subgraph/polygon-amoy`
            },
            artela: {
                uri: `${apiEndpoint}/subgraph/artela`
            },
            unichainSepolia: {
                uri: `${apiEndpoint}/subgraph/unichain-sepolia`
            },
            base: {
                uri: `${apiEndpoint}/subgraph/base`
            },
            iota: {
                uri: `${apiEndpoint}/subgraph/iota`
            }
        },
        evm: {
            addresses: {
                bartio: {
                    rocket: isProd
                        ? NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD ?? ''
                        : NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS ?? ''
                },
                baseSepolia: {
                    rocket: isProd
                        ? NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS_PROD ?? ''
                        : NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS ?? ''
                },
                polygonAmoy: {
                    rocket: NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS ?? ''
                },
                artela: {
                    rocket: NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS ?? ''
                },
                unichainSepolia: {
                    rocket: NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS ?? ''
                },
                base: {
                    rocket: isProd
                        ? NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD ?? ''
                        : NEXT_PUBLIC_BASE_CONTRACT_ADDRESS ?? ''
                },
                iota: {
                    rocket: isProd
                        ? NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD ?? ''
                        : NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS ?? ''
                }
            }
        }
    };
};

export const configs = getConfigs('');
