/* eslint-disable */

import { ConfigService } from '@/src/config/services/config-service';
import { IGetDetailPoolParams } from '@/src/stores/pool/type';
import { querySubGraph } from '../fetcher';
const config = ConfigService.getInstance();

const serviceChart = {
    getChartInfoByMinute: ({ poolAddress, chainId }: IGetDetailPoolParams) => {
        const query = {
            query: `
                query getChartInfoByMinute {
                    poolMinuteDatas( 
                      orderBy: minuteStartUnix,
                      orderDirection: asc,
                    where: {
                      pool: "${poolAddress}"
                    }
                  ) {
                id
                price
                volumeETH
                minuteStartUnix
                priceLowest
                priceHighest
                priceOpen
                txns
              }
                }  

            `
        };
        return querySubGraph(query, chainId);
    },
    getChartInfoByHour: ({ poolAddress, chainId }: IGetDetailPoolParams) => {
        const query = {
            query: `
                query getChartInfoByHour {
                    poolHourDatas( 
                    orderBy: hourStartUnix,
                    orderDirection: asc,
                    where: {
                pool: "${poolAddress}"
              }) {
                id
                price
                volumeETH
                hourStartUnix
                priceLowest
                priceHighest
                priceOpen
                txns
              }
                }  
            `
        };

        return querySubGraph(query, chainId);
    },
    getChartInfoByDay: ({ poolAddress, chainId }: IGetDetailPoolParams) => {
        const query = {
            query: `   

            
              query getChartInfoByDay {
                    poolDayDatas(
                    orderBy: dayStartUnix,
                    orderDirection: asc,
                    where: {
                pool: "${poolAddress}"
              }) {
                id
                price
                volumeETH
                dayStartUnix
                priceLowest
                priceHighest
                priceOpen
                txns
              }
                }  
            `
        };

        return querySubGraph(query, chainId);
    },
    getChartInfoBy5Minute: ({ poolAddress, chainId }: IGetDetailPoolParams) => {
        const query = {
            query: `
                query getChartInfoBy5Minute {
                    pool5MinuteDatas( 
                      orderBy: minuteStartUnix,
                      orderDirection: asc,
                    where: {
                      pool: "${poolAddress}"
                    }
                  ) {
                    id
                    price
                volumeETH
                minuteStartUnix
                priceLowest
                priceHighest
                priceOpen
                txns
              }
                }  

            `
        };
        return querySubGraph(query, chainId);
    }
};

export default serviceChart;
