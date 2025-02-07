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

    _toNumber(num: any) {
        try {
            return new BigNumber(num).toNumber();
        } catch (er) {
            return Number.parseFloat(ethers.formatEther(num));
        }
    }

    _toEther(bigNumber: any) {
        return Number.parseFloat(ethers.formatEther(bigNumber));
    }

    async _toWei(amount: number) {
        return ethers.parseUnits(amount.toString());
    }
}
