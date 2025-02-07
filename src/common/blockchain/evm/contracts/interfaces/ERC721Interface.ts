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

    async balanceOf(owner: string) {
        return this._contract.balanceOf(owner);
    }

    async ownerOf(tokenId: string) {
        return this._contract.ownerOf(tokenId);
    }

    async safeTransferFrom(from: string, to: string, tokenId: string) {
        const tx: TransactionResponse = await this._contract[
            'safeTransferFrom(address,address,uint256)'
        ](from, to, tokenId, this._option);
        return this._handleTransactionResponse(tx);
    }

    async transferFrom(from: string, to: string, tokenId: string) {
        const tx: TransactionResponse = await this._contract.transferFrom(
            from,
            to,
            tokenId
        );
        return this._handleTransactionResponse(tx);
    }

    async approve(to: string, tokenId: string) {
        return this._contract.approve(to, tokenId);
    }
}
