import { PoolStatus } from '@/src/common/constant/constance';

const entities = ` {
          id
          owner
          name
          symbol
          decimals
          metadata
          startTime
          endTime
          minDurationSell
          totalSupplyToken
          tokenForAirdrop
          tokenForFarm
          tokenForSale
          tokenForLiquidity
          capInETH
          totalBatch
          tokenPerBatch
          batchAvailable
          raisedInETH
          soldBatch
          feeForLiquidity
          latestTimestampBuy
          latestBuyTransactionHash
          totalTransaction
          status
          changePrice24h
          buyTransactions {
            eth
            blockNumber
          }
          tgeTimestamp
          reserveETH
          reserveToken
        }`;
export interface IParams {
    status: PoolStatus;
    query: string;
    owner?: string;
}

function getQueryPools(params: IParams) {
    const isContractAddress = /^0x[a-fA-F0-9]{40}$/.test(params.query);
    let query;
    let currentEpoch = Math.round(Date.now() / 1000).toFixed(0);
    switch (params.status) {
        case PoolStatus.MY_POOl:
            query = `pools(where: {
                  and: [
                    {owner: "${params?.owner?.toLocaleLowerCase()}"},
                    {or: [
                      {name_contains_nocase: "${params.query}"},
                      
                      ${isContractAddress ? `{tokenAddress_contains_nocase:"${params.query.toLowerCase()}"}` : ''}
                    ]}
                  ]
                  }
                  orderBy: latestTimestamp,
                  orderDirection: desc
                )
              `;
            break;
        case PoolStatus.ACTIVE:
            query = `pools(where: {
                and: [
                  {status: "ACTIVE"},
                  {endTime_gte: "${currentEpoch}"},
                  {startTime_lte: "${currentEpoch}"},
                  {or: [
                    {name_contains_nocase: "${params.query}"},
                     ${isContractAddress ? `{tokenAddress_contains_nocase:"${params.query.toLowerCase()}"}` : ''}
                  ]}
                ]
                }
                orderBy: latestTimestamp,
                orderDirection: desc
              )
            `;
            break;
        case PoolStatus.UP_COMING:
            query = `pools(where: {
                and: [
                  {status: "ACTIVE"},
                  {startTime_gt: "${currentEpoch}"},  
                  {or: [
                    {name_contains_nocase: "${params.query}"},
                    ${isContractAddress ? `{tokenAddress_contains_nocase:"${params.query.toLowerCase()}"}` : ''}
                    ]}
                  ]}
                orderBy: startTime,
                orderDirection: desc
              )`;
            break;
        case PoolStatus.All_POOL:
            query = `pools(where: {
                and: [
                  {or: [
                    {name_contains_nocase: "${params.query}"},
                    ${isContractAddress ? `{tokenAddress_contains_nocase:"${params.query.toLowerCase()}"}` : ''}
                    ]}
                  ]}
                orderBy: latestTimestampBuy,
                orderDirection: desc
              )`;
            break;
        default:
            query = `pools(where: {
                and: [
                  {status: "${params.status}"},
                  {or: [
                    {name_contains_nocase: "${params.query}"},
                    ${isContractAddress ? `{tokenAddress_contains_nocase:"${params.query.toLowerCase()}"}` : ''}
                  ]}
                ]
                }
                orderBy: latestTimestampBuy,
                orderDirection: desc
              )`;
            break;
    }
    return query;
}
export const getQueryByStatus = (prams: IParams) => {
    return `query { ${getQueryPools(prams)} ${entities} }`;
};
