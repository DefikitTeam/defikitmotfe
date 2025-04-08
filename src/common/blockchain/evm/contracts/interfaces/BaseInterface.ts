import { BigNumber } from 'bignumber.js';
import { ethers, Overrides, TransactionResponse } from 'ethers';

export default class BaseInterface {
    _provider: ethers.JsonRpcProvider | ethers.BrowserProvider;
    _contractAddress: string;
    _abis: ethers.InterfaceAbi;
    _contract!: ethers.Contract;
    _option: Overrides;

    constructor(
        provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
        address: string,
        abi: ethers.InterfaceAbi
    ) {
        this._provider = provider;
        this._contractAddress = address;
        this._abis = abi;
        this._option = { gasLimit: 1000000 };

        const signerPromise = this.resolveSigner(provider);

        signerPromise.then((signer) => {
            this._contract = new ethers.Contract(address, abi, signer);
        });
    }

    private async resolveSigner(
        provider: ethers.JsonRpcProvider | ethers.BrowserProvider
    ): Promise<ethers.Signer> {
        const signer = await provider.getSigner();
        return signer;
    }

    async _handleTransactionResponse(tx: TransactionResponse) {
        const receipt = await tx.wait();
        return receipt?.hash;
    }

    _toNumber(num: string | number | bigint | BigNumber | { toString(): string }): number {
        if (num === undefined || num === null) {
            return 0;
        }

        try {
            if (num instanceof BigNumber) {
                return num.toNumber();
            }
            const bigNum = new BigNumber(num.toString());
            return bigNum.toNumber();
        } catch (er) {
            if (typeof num === 'bigint' || typeof num === 'string') {
                return Number.parseFloat(ethers.formatEther(num));
            }
            return Number(num);
        }
    }

    _toEther(bigNumber: string | bigint | { toString(): string }) {
        if (bigNumber === undefined || bigNumber === null) {
            return 0;
        }
        return Number.parseFloat(ethers.formatEther(bigNumber.toString()));
    }

    async _toWei(amount: number) {
        return ethers.parseUnits(amount.toString());
    }
}
