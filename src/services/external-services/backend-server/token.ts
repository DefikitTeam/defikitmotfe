import { IGetTokensByOwnerParams } from '@/src/stores/token/type';
import { querySubGraph } from '../fetcher';

const serviceToken = {
    getTokensByOwner: ({
        ownerAddress,
        status,
        chainId
    }: IGetTokensByOwnerParams) => {
        const query = {
            query: `

            query getTokensByOwner {
  tokens(where: {owner: "${ownerAddress}"
  , status: "${status}"
  }) {
    id
    owner
    name
    symbol
    decimals
    totalSupply
    status
  }
}



            
            `
        };
        return querySubGraph(query, chainId);
    }
};

export default serviceToken;
