/* eslint-disable */
import {
    currencyFormatter,
    randomDefaultPoolImage
} from '@/src/common/utils/utils';
import Image from 'next/image';
import useWindowSize from '@/src/hooks/useWindowSize';
import { IAnalystData, IMetaData, IPoolList } from '@/src/stores/pool/type';
import { Typography } from 'antd';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import BubbleUp from '@/src/components/common/bubble-up';
import { useConfig } from '@/src/hooks/useConfig';
interface Props {
    poolItem: IPoolList;
    metadata?: IMetaData | undefined;
    analysisData?: IAnalystData | undefined;
    onClick: () => void;
    className?: string;
    priceNative: number;
}
const { Text } = Typography;

const ItemPool = (props: Props) => {
    const { isMobile } = useWindowSize();

    const { chainConfig } = useConfig();

    const [animationNewTransactionClass, setAnimationNewTransactionClass] =
        useState('');
    // const [currency, setCurrency] = useState('ETH');

    const { poolItem, onClick, analysisData, metadata, priceNative } = props;
    const marketCap = new BigNumber(poolItem.raisedInETH).div(1e18);

    const image: any =
        metadata && metadata?.image
            ? metadata?.image
            : metadata?.tokenImageUrl
                ? metadata?.tokenImageUrl
                : randomDefaultPoolImage();

    let finalImageUrl: string;
    if (typeof image === 'object') {
        finalImageUrl = image.value;
    } else {
        finalImageUrl = image;
    }

    const description =
        metadata &&
            metadata?.description &&
            typeof metadata?.description === 'string'
            ? metadata?.description
            : '';

    const raisedShow = marketCap.isEqualTo(0)
        ? `0`
        : marketCap.isLessThanOrEqualTo(0.001)
            ? `<0.001`
            : `${marketCap.toFixed(3)} - $${currencyFormatter(
                marketCap.times(priceNative),
                2
            )}`;

    const hardCap = new BigNumber(poolItem.capInETH);
    const hardCapShow = hardCap.isZero() ? '0' : hardCap.div(1e18).toFixed(3);

    const apy = new BigNumber(analysisData?.apy || 0);
    const apyShow = apy.isGreaterThan(10000) ? '>10000%' : apy + '%';

    const expectProfitShow =
        analysisData?.liquidityPrice &&
            (analysisData?.currentPrice || analysisData?.startPrice) &&
            !isNaN(Number(analysisData?.liquidityPrice)) &&
            !isNaN(
                Number(analysisData?.currentPrice) ||
                Number(analysisData?.startPrice)
            )
            ? new BigNumber(analysisData?.liquidityPrice)
                .div(
                    new BigNumber(
                        analysisData?.currentPrice || analysisData?.startPrice
                    )
                )
                .times(100)
                .toFixed(0) + '%'
            : '0%';

    const bondingCurve = new BigNumber(poolItem.raisedInETH)
        .times(100)
        .div(poolItem.capInETH);

    const maxBlockNumber = Math.max(
        ...poolItem.buyTransactions?.map((transaction) =>
            Number(transaction.blockNumber)
        )
    );
    const [lastBlockNumber, setLastBlockNumber] = useState(maxBlockNumber);
    const [buyAmounts, setBuyAmounts] = useState<string[]>([]);
    useEffect(() => {
        if (!poolItem || !poolItem.buyTransactions) return;
        const sumEth = new BigNumber(
            poolItem.buyTransactions
                .filter(
                    (transaction) =>
                        Number(transaction.blockNumber) > lastBlockNumber
                )
                .reduce(
                    (total, transaction) => total + Number(transaction.eth),
                    0
                )
        ).div(1e18);
        setLastBlockNumber(maxBlockNumber);
        if (sumEth.isLessThanOrEqualTo(0)) {
            setAnimationNewTransactionClass('');
            setBuyAmounts([]);
            return;
        }
        setBuyAmounts([`+${sumEth.toFixed(6)} ${chainConfig?.currency}`]);
        setAnimationNewTransactionClass('animate-blink shake');
    }, [poolItem.buyTransactions]);

    return (
        <div
            className={`relative flex min-h-[250px] animate-fallDown cursor-pointer flex-col justify-start p-2 text-black shadow hover:shadow-hover ${animationNewTransactionClass}
            
${isMobile ? `${props.className}` : `${props.className}`}
        
        
        `}
        >
            <BubbleUp contents={buyAmounts}></BubbleUp>
            <div
                className="flex"
                onClick={onClick}
            >
                <img
                    loading={'lazy'}
                    src={
                        !finalImageUrl
                            ? randomDefaultPoolImage()
                            : finalImageUrl
                    }
                    alt="{poolItem.name} - {poolItem.symbol}"
                    className={`rounded-lg border ${isMobile ? 'h-20 w-20' : 'h-20 w-20'
                        }`}
                />

                {/* <Image
                    src={
                        !finalImageUrl
                            ? randomDefaultPoolImage()
                            : finalImageUrl
                    }
                    alt={`${poolItem.name} - ${poolItem.symbol}`}
                    className={`rounded-lg border ${isMobile ? 'h-20 w-20' : 'h-20 w-20'}`}
                    width={80}
                    height={80}
                    loading="lazy"
                /> */}

                <div className="ml-2 flex w-80 flex-col text-left !font-forza">
                    <Text className="!font-forza">
                        <span className="!font-forza text-lg font-bold">
                            {poolItem.name} - {poolItem.symbol}
                        </span>
                    </Text>
                    <Text
                        className={`!font-forza ${isMobile ? '' : 'text-lg-important'}`}
                    >
                        Raised/HC:{' '}
                        <span className="text-lg text-blue-800">
                            {raisedShow}/{hardCapShow} ({chainConfig?.currency},{' '}
                            {bondingCurve.toFixed(2)} % )
                        </span>
                    </Text>
                    <Text
                        className={`!font-forza ${isMobile ? '' : 'text-lg-important'}`}
                    >
                        Farming APY:{' '}
                        <span className="text-lg font-extrabold text-green">
                            {apyShow}
                        </span>
                    </Text>
                    <Text
                        className={`!font-forza ${isMobile ? '' : 'text-lg-important'}`}
                    >
                        {' '}
                        Recent Transaction:{' '}
                        <span className="text-blue-800">
                            {Number(poolItem.latestTimestampBuy) === 0 ? (
                                'N/A'
                            ) : (
                                <Moment fromNow>
                                    {
                                        new Date(
                                            Number(
                                                poolItem.latestTimestampBuy
                                            ) * 1000
                                        )
                                    }
                                </Moment>
                            )}
                        </span>
                    </Text>
                    <Text
                        className={`!font-forza ${isMobile ? '' : 'text-lg-important'}`}
                    >
                        Total Tx:{' '}
                        <span className="text-lg text-blue-800">
                            {poolItem.totalTransaction}
                        </span>
                    </Text>
                    <Text
                        className={`!font-forza ${isMobile ? '' : 'text-lg-important'}`}
                    >
                        Expect profit:{' '}
                        <span className="text-lg font-extrabold text-green">
                            {
                                <span className="font-extrabold text-green">
                                    {expectProfitShow}
                                </span>
                            }
                        </span>
                    </Text>
                    <div className="mt-2 max-h-[35px] overflow-hidden text-ellipsis whitespace-nowrap font-forza text-lg">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemPool;
