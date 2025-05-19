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

export interface IMonthlyQueryParams
    extends Omit<IWeeklyQueryParams, 'weekStartUnix'> {
    monthStartUnix: number; // Unix timestamp for the start of the month
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

const userTrustScoreMonthlyEntities = `

{
      id
      user {
        id
        multiplier
      }
      monthStartUnix
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

const poolTrustScoreMonthlyEntities = `


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
    monthStartUnix
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

function buildMonthlyQuery(
    entityType: 'userTrustScoreMonthlies' | 'poolTrustScoreMonthlies',
    params: IMonthlyQueryParams,
    entities: string
) {
    const {
        first = 100,
        orderBy = 'trustScore',
        orderDirection = 'desc',
        monthStartUnix
    } = params;

    const whereClause = `{ monthStartUnix: ${monthStartUnix} }`;

    return `
      ${entityType}(
        first: ${first} 
        orderBy: ${orderBy}
        orderDirection: ${orderDirection}
        where: ${whereClause}
      ) ${entities}
    `;
}

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

export const getTop100TPMonthlyCombinedQuery = (params: {
    monthStartUnix: number;
}) => {
    const queryParams: IMonthlyQueryParams = {
        ...params,
        first: 100,
        orderBy: 'trustScore',
        orderDirection: 'desc'
    };

    const userQueryPart = buildMonthlyQuery(
        'userTrustScoreMonthlies',
        queryParams,
        userTrustScoreMonthlyEntities
    );
    const poolQueryPart = buildMonthlyQuery(
        'poolTrustScoreMonthlies',
        queryParams,
        poolTrustScoreMonthlyEntities
    );

    return `query top100TPMonthly {
      ${userQueryPart}
      ${poolQueryPart}
    }`;
};







