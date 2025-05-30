export interface PoolDataMinuteChart {
  id: string;
  price: string;
  priceOpen: string;
  priceHighest: string;
  priceLowest: string;
  volumeETH: string;
  minuteStartUnix: number;
  txns: string;
}
export interface PoolDataHourChart {
  id: string;
  price: string;
  priceOpen: string;
  priceHighest: string;
  priceLowest: string;
  volumeETH: string;
  hourStartUnix: number;
  txns: string;
}
export interface PoolDataDayChart {
  id: string;
  price: string;
  priceOpen: string;
  priceHighest: string;
  priceLowest: string;
  volumeETH: string;
  dayStartUnix: number;
  txns: string;
}
