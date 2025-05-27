/* eslint-disable */
import BigNumber from 'bignumber.js';

const commaNumber = require('comma-number');

export const shortWalletAddress = (address: string): string => {
  return address.slice(0, 7) + '...' + address.slice(-4);
};

const images = [
  '/images/default-avt-1.png',
  '/images/default-avt-2.png',
  '/images/default-avt-3.png',
  '/images/default-avt-4.png',
  '/images/default-avt-5.png',
  '/images/default-avt-6.png',
  '/images/default-avt-7.png',
  '/images/default-avt-8.png'
];
export const randomDefaultPoolImage = () => {
  // const randomIndex = Math.floor(Math.random() * images.length);
  // return images[randomIndex];
  // return 'https://s2.coinmarketcap.com/static/img/coins/64x64/8978.png';
  return '/images/default-item-pool.jpg';
};
export const formatCurrency = (value: string | number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const convertTimeToLocalDate = (timestamp: string | undefined) => {
  if (timestamp) {
    const date = new Date(
      timestamp.length <= 10 ? parseInt(timestamp) * 1000 : parseInt(timestamp)
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }
};

export const currentEpochTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const calculateTimeLeft = (targetDate: string): any => {
  const targetInNum = parseInt(targetDate) * 1000;
  const now = new Date();
  const difference: any = targetInNum - now.valueOf();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return timeLeft;
};

export const format = commaNumber.bindWith(',', '.');
export const currencyFormatter = (labelValue: any, decimalPlaces = 6) => {
  // nine zeros for billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? `${format(new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e9}`).dp(2, 1))}B`
    : // six zeros for millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? `${format(
          new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e6}`).dp(2, 1)
        )}M`
      : // three zeros for thousands
        format(new BigNumber(labelValue).toFixed(decimalPlaces));
};

export const getDateTimeInFormat = (date: Date) => {
  const padTo2Digits = (num: any) => {
    return num.toString().padStart(2, '0');
  };
  const year = date.getFullYear();
  const month = padTo2Digits(date.getMonth() + 1);
  const day = padTo2Digits(date.getDate());
  const hours = padTo2Digits(date.getHours());
  const minutes = padTo2Digits(date.getMinutes());
  const seconds = padTo2Digits(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const divToDecimal = (param: string | undefined): any => {
  if (param) {
    return new BigNumber(param).div(1e18).toString();
  }
  return '0';
};

export const nextMinuteFrom = (currentDate: Date, dayPlus: number): Date => {
  currentDate.setMinutes(currentDate.getMinutes() + dayPlus);
  return currentDate;
};

export const nextHourFromCurrent = (date: Date): Date => {
  date.setHours(date.getHours() + 1);
  return date;
};
export const nextDayFromCurrent = (date: Date): Date => {
  date.setDate(date.getDate() + 1);
  return date;
};
export const nextDayFrom = (currentDate: Date, dayPlus: number) => {
  currentDate.setDate(currentDate.getDate() + dayPlus);
  return currentDate;
};

export const prevDayFrom = (currentDate: Date, dayMinus: number) => {
  currentDate.setDate(currentDate.getDate() - dayMinus);
  return currentDate;
};
export const isValidEtherInput = (value: string) => {
  return /^(\d+(\.\d{1,18})?)$/.test(value);
};
