// export const getTimeKey = async () => {
//     const ONE_DAY = 86400;
//     const ONE_WEEK = 604800;
//     const ONE_MONTH = 2592000;

//     const nowEpoch = Math.floor(Date.now() / 1000);

//     const dayKey = nowEpoch - (nowEpoch % ONE_DAY);
//     const weekKey = nowEpoch - (nowEpoch % ONE_WEEK);
//     const monthKey = nowEpoch - (nowEpoch % ONE_MONTH);
//     return {
//         dayKey,
//         weekKey,
//         monthKey
//     };
// };

// getTimeKey()
// npx ts-node src/common/utils/get-time-key.ts
import dayjs from 'dayjs';

export const ONE_DAY_SECONDS = 86400;
export const ONE_WEEK_SECONDS = 604800;
export const ONE_MONTH_SECONDS = 2592000; // 30 ngày cố định

export const calculateDayStartUnixForDate = (date: dayjs.Dayjs): number => {
  const epochSeconds = date.utc().unix();
  return epochSeconds - (epochSeconds % ONE_DAY_SECONDS);
};

export const calculateWeekStartUnixForDate = (date: dayjs.Dayjs): number => {
  const epochSeconds = date.utc().unix();
  return epochSeconds - (epochSeconds % ONE_WEEK_SECONDS);
};

export const calculateMonthStartUnixForDate_Inaccurate = (
  date: dayjs.Dayjs
): number => {
  const epochSeconds = date.utc().unix();
  return epochSeconds - (epochSeconds % ONE_MONTH_SECONDS);
};
