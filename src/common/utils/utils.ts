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


// Helper function to check if a year is a leap year
export function isLeapYear(year: number): boolean {
  return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

// Helper function to get days in a month
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month == 2 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month - 1]
}

// Calculate month start timestamp without Date object
export function getMonthStartTimestamp(timestamp: number): number {
  // Days since Unix epoch (Jan 1, 1970)
  const daysSinceEpoch = timestamp / 86400

  // Calculate year (approximate, then adjust)
  let year = 1970 + (daysSinceEpoch / 365)

  // Calculate exact year by counting days
  let daysFromEpoch = 0
  for (let y = 1970; y < year; y++) {
    daysFromEpoch += isLeapYear(y) ? 366 : 365
  }

  // Adjust if we went too far
  while (daysFromEpoch > daysSinceEpoch) {
    year--
    daysFromEpoch -= isLeapYear(year) ? 366 : 365
  }

  // Calculate which month we're in
  let month = 1
  let monthStartDays = daysFromEpoch

  while (month <= 12) {
    const daysInCurrentMonth = getDaysInMonth(year, month)
    if (monthStartDays + daysInCurrentMonth > daysSinceEpoch) {
      break
    }
    monthStartDays += daysInCurrentMonth
    month++
  }

  // Return timestamp for first day of the month at 00:00:00 UTC
  return monthStartDays * 86400
}

export function getWeekStartTimestamp(timestamp: number): number {
  const weekKey = timestamp - (timestamp % 604800);
  return weekKey
}