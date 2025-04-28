export const getTimeKey = async () => {
    const ONE_DAY = 86400;
    const ONE_WEEK = 604800;
    const ONE_MONTH = 2592000;
    const nowEpoch = Math.floor(Date.now() / 1000);
    const dayKey = nowEpoch - (nowEpoch % ONE_DAY);
    const weekKey = nowEpoch - (nowEpoch % ONE_WEEK);
    const monthKey = nowEpoch - (nowEpoch % ONE_MONTH);
    // console.log("dayKey: ", dayKey);
    // console.log("weekKey: ", weekKey);
    // console.log("monthKey: ", monthKey);
    return {
        dayKey,
        weekKey,
        monthKey
    };
};

// getTimeKey()
// npx ts-node src/common/utils/get-time-key.ts
