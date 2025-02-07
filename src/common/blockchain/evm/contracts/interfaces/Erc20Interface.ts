import BaseInterface from './BaseInterface';

import { ethers } from 'ethers';

export default class Erc20 extends BaseInterface {
    constructor(
        provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
        address: string,
        abi: ethers.InterfaceAbi
    ) {
        super(provider, address, abi);
    }

    async name(): Promise<string> {
        return this._contract.name();
    }

    async symbol(): Promise<string> {
        return this._contract.symbol();
    }

    async decimals(): Promise<number> {
        return this._contract.decimals();
    }

    async balanceOf(owner: string): Promise<number> {
        return this._contract.balanceOf(owner);
    }

    async owner(): Promise<string> {
        return this._contract.owner();
    }

    async totalSupply(): Promise<number> {
        const total = await this._contract.totalSupply();
        return this._toNumber(total);
    }

    async approve(spenderAddress: string, amount: number) {
        const wei = ethers.parseUnits(amount.toString());
        await this._contract.approve(spenderAddress, wei, this._option);
    }
}
