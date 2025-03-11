import { developmentConfig } from '../environments/development';
import { ChainConfig, EnvironmentConfig } from '../type';
export class ConfigService {
    private static instance: ConfigService;
    private currentConfig: EnvironmentConfig;
    // private environment: Environment;

    private constructor() {
        // this.environment =
        //     (NEXT_PUBLIC_ENVIRONMENT as Environment) || 'development';
        this.currentConfig = this.loadConfig();
    }

    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    private loadConfig(): EnvironmentConfig {
        // switch (this.environment) {
        //     case 'production':
        //         return productionConfig;
        //     case 'staging':
        return developmentConfig;
        //     case 'development':
        //     default:
        //         return developmentConfig;
        // }
    }

    getChainConfig(chainId: number): ChainConfig | undefined {
        return this.currentConfig.chains[chainId];
    }
    getApiConfig() {
        return this.currentConfig.api;
    }

    getSupportedChains(): number[] {
        return this.currentConfig.supportedChains;
    }

    getDefaultChain(): number {
        return this.currentConfig.defaultChain;
    }

    isChainSupported(chainId: number): boolean {
        return this.currentConfig.supportedChains.includes(chainId);
    }

    // getEnvironment(): Environment {
    //     return this.environment;
    // }

    getContractAddress(
        chainId: number,
        contractKey: keyof ChainConfig['addresses']
    ): string | undefined {
        return this.getChainConfig(chainId)?.addresses[contractKey];
    }

    getSubgraphUri(chainId: number): string | undefined {
        return this.getChainConfig(chainId)?.subgraph.uri;
    }

    getContractAbi(chainId: number): any {
        return this.getChainConfig(chainId)?.contractAbis;
    }

    getRpcUrl(chainId: number): string | undefined {
        return this.getChainConfig(chainId)?.rpcUrl;
    }

    getExplorer(chainId: number): string | undefined {
        return this.getChainConfig(chainId)?.explorer;
    }




    // Thêm phương thức này vào class ConfigService
    getPlatformFee(chainId: number): number {
        return this.getChainConfig(chainId)?.platformFee || 0;
    }

    // Tương tự, bạn có thể thêm các phương thức khác
    getBlockInterval(chainId: number): number {
        return this.getChainConfig(chainId)?.blockInterval || 2;
    }

    getHardCapInitial(chainId: number): number {
        return this.getChainConfig(chainId)?.hardCapInitial || 0;
    }

    getMinHardcap(chainId: number): { min: number; error: string } | undefined {
        return this.getChainConfig(chainId)?.minHardcap;
    }

    getDexInfo(chainId: number): { name: any; linkSwap: string } | undefined {
        return this.getChainConfig(chainId)?.dex;
    }
}
