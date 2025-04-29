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

// Trust Point Daily Queries
export interface IDailyQueryParams {
    first?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    dayStartUnix: number; // Unix timestamp for the start of the day
}

export interface IWeeklyQueryParams
    extends Omit<IDailyQueryParams, 'dayStartUnix'> {
    weekStartUnix: number; // Unix timestamp for the start of the week
}

const userTrustScoreDailyEntities = ` {
    id
    user {
      id
      multiplier
    }
    dayStartUnix
    trustScore
    volume
    }`;

const userTrustScoreWeeklyEntities = `
    {
      id
      user {
        id
        multiplier
      }
      weekStartUnix
      trustScore
      volume



}


`;

const poolTrustScoreDailyEntities = ` {
    id
    pool {
      id
      multiplier
      name
      symbol
      metadata
      changePrice24h
    }
    dayStartUnix
    tokenTrustPoint
    trustScore
    volume
}`;

const poolTrustScoreWeeklyEntities = `
{
id
    pool {
      id
      multiplier
      name
      symbol
      metadata
      changePrice24h
    }
    weekStartUnix
    tokenTrustPoint
    trustScore
    volume



}


`;

function buildDailyQuery(
    entityType: 'userTrustScoreDailies' | 'poolTrustScoreDailies',
    params: IDailyQueryParams,
    entities: string
) {
    const {
        first = 100,
        orderBy = 'trustScore',
        orderDirection = 'desc',
        dayStartUnix
    } = params;
    // Ensure dayStartUnix is treated as a number, not a string in the query
    const whereClause = `{ dayStartUnix: ${dayStartUnix} }`;

    return `
      ${entityType}(
        first: ${first}
        orderBy: ${orderBy}
        orderDirection: ${orderDirection}
        where: ${whereClause}
      ) ${entities}
    `;
}

function buildWeeklyQuery(
    entityType: 'userTrustScoreWeeklies' | 'poolTrustScoreWeeklies',
    params: IWeeklyQueryParams,
    entities: string
) {
    const {
        first = 100,
        orderBy = 'trustScore',
        orderDirection = 'desc',
        weekStartUnix
    } = params;
    const whereClause = `{ weekStartUnix: ${weekStartUnix} }`;

    return `
      ${entityType}(
        first: ${first} 
        orderBy: ${orderBy}
        orderDirection: ${orderDirection}
        where: ${whereClause}
      ) ${entities}
    `;
}

// /**
//  * Generates a GraphQL query string to fetch the top 100 daily trust scores for users.
//  * @param params - Parameters containing the dayStartUnix timestamp.
//  * @returns The GraphQL query string.
//  */
// export const getTop100TPDailyWalletQuery = (params: { dayStartUnix: number }) => {
//   const queryParams: IDailyQueryParams = {
//     ...params,
//     first: 100,
//     orderBy: 'trustScore',
//     orderDirection: 'desc'
//   };
//   return `query top100TPDailyWallet {
//       ${buildDailyQuery('userTrustScoreDailies', queryParams, userTrustScoreDailyEntities)}
//     }`;
// };

// /**
//  * Generates a GraphQL query string to fetch the top 100 daily trust scores for pools (tokens).
//  * @param params - Parameters containing the dayStartUnix timestamp.
//  * @returns The GraphQL query string.
//  */
// export const getTop100TPDailyTokenQuery = (params: { dayStartUnix: number }) => {
//   const queryParams: IDailyQueryParams = {
//     ...params,
//     first: 100,
//     orderBy: 'trustScore',
//     orderDirection: 'desc'
//   };
//   return `query top100TPDailyToken {
//       ${buildDailyQuery('poolTrustScoreDailies', queryParams, poolTrustScoreDailyEntities)}
//     }`;
// };

// /**
//  * Generates a general GraphQL query string for daily trust scores (user or pool).
//  * @param type - Specifies whether to query for 'user' or 'pool'.
//  * @param params - Query parameters like filtering, sorting, and pagination.
//  * @returns The GraphQL query string.
//  */
// export const getDailyTrustScoreQuery = (
//   type: 'user' | 'pool',
//   params: IDailyQueryParams
// ) => {
//   if (type === 'user') {
//     return `query GetUserTrustScoreDailies {
//         ${buildDailyQuery('userTrustScoreDailies', params, userTrustScoreDailyEntities)}
//       }`;
//   } else {
//     return `query GetPoolTrustScoreDailies {
//         ${buildDailyQuery('poolTrustScoreDailies', params, poolTrustScoreDailyEntities)}
//       }`;
//   }
// };

/**
 * Generates a combined GraphQL query string to fetch the top 100 daily trust scores
 * for both users and pools (tokens) in a single request.
 * @param params - Parameters containing the dayStartUnix timestamp.
 * @returns The combined GraphQL query string.
 */
export const getTop100TPDailyCombinedQuery = (params: {
    dayStartUnix: number;
}) => {
    const queryParams: IDailyQueryParams = {
        ...params,
        first: 100,
        orderBy: 'trustScore',
        orderDirection: 'desc'
    };
    const userQueryPart = buildDailyQuery(
        'userTrustScoreDailies',
        queryParams,
        userTrustScoreDailyEntities
    );
    const poolQueryPart = buildDailyQuery(
        'poolTrustScoreDailies',
        queryParams,
        poolTrustScoreDailyEntities
    );

    return `query top100TPDaily {
      ${userQueryPart}
      ${poolQueryPart}
    }`;
};

export const getTop100TPWeeklyCombinedQuery = (params: {
    weekStartUnix: number;
}) => {
    const queryParams: IWeeklyQueryParams = {
        ...params,
        first: 100,
        orderBy: 'trustScore',
        orderDirection: 'desc'
    };

    const userQueryPart = buildWeeklyQuery(
        'userTrustScoreWeeklies',
        queryParams,
        userTrustScoreWeeklyEntities
    );
    const poolQueryPart = buildWeeklyQuery(
        'poolTrustScoreWeeklies',
        queryParams,
        poolTrustScoreWeeklyEntities
    );

    return `query top100TPWeekly {
      ${userQueryPart}
      ${poolQueryPart}
    }`;
};
