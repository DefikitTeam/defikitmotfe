import BaseInterface from './BaseInterface';

import { ethers, type TransactionResponse } from 'ethers';

export default class ERC721 extends BaseInterface {
    constructor(
        provider: ethers.JsonRpcProvider | ethers.BrowserProvider,
        address: string,
        abi: ethers.InterfaceAbi
    ) {
        super(provider, address, abi);
    }

    async balanceOf(owner: string): Promise<number> {
        const balance = await this._contract.balanceOf(owner);
        return this._toNumber(balance);
    }

    async ownerOf(tokenId: string | number): Promise<string> {
        return this._contract.ownerOf(tokenId.toString());
    }

    async safeTransferFrom(from: string, to: string, tokenId: string | number) {
        const tx: TransactionResponse = await this._contract[
            'safeTransferFrom(address,address,uint256)'
        ](from, to, tokenId.toString(), this._option);
        return this._handleTransactionResponse(tx);
    }

    async transferFrom(from: string, to: string, tokenId: string | number) {
        const tx: TransactionResponse = await this._contract.transferFrom(
            from,
            to,
            tokenId.toString()
        );
        return this._handleTransactionResponse(tx);
    }

    async approve(to: string, tokenId: string | number) {
        const tx: TransactionResponse = await this._contract.approve(to, tokenId.toString());
        return this._handleTransactionResponse(tx);
    }
}
