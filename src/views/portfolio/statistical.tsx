/* eslint-disable */
'use client';
import { IPool } from '@/src/services/response.type';
import { IAnalystData, InvestPool } from '@/src/stores/pool/type';
import { usePortfolio } from '@/src/stores/profile/hook';
import { Button, notification, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Table from 'antd/lib/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { TOKEN_STATUS } from '@/src/common/constant/constance';
import { formatCurrency, shortWalletAddress } from '@/src/common/utils/utils';
import { useConfig } from '@/src/hooks/useConfig';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';
import { RootState } from '@/src/stores';
import { useListPool } from '@/src/stores/pool/hook';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import Investpool from './Investpool';
import RecentTx from './recent-tx';
export interface IAssetList {
    index: number;
    id: string;
    symbolAndName: string;
    currentPrice: string;
    time24h: string;
    bondAmount: string;
    claimable: string;
    incentivesInfo: string;
    status: string;
    pendingClaimAmount: string;
    analystData: { [key: string]: { id: string; analystData?: IAnalystData } };
}

const Statistical = () => {
    const t = useTranslations();

    const { chainConfig } = useConfig();
    const [isLoadingClaimTokenOrSell, setIsLoadingClaimTokenOrSell] =
        useState(false);
    const { address, chainId, isConnected } = useAccount();
    const router = useRouter();
    const [{ portfolio }, fetchPortfolio, setIdCurrentChoosedTokenSell] =
        usePortfolio();
    const chainData = useSelector((state: RootState) => state.chainData);
    const { poolStateList } = useListPool();
    const { isMobile } = useWindowSize();
    const { totalInvestedETH } = portfolio;
    const [activeInvestPools, setActiveInvestPools] = useState<IPool[]>([]);
    const [loadingTableAsset, setLoadingTableAsset] = useState(false);
    const [claimMap, setClaimMap] = useState(new Map<string, InvestPool>());
    const params = useParams();
    const addressParams = params?.walletAddress as string;
    const isAddressDifferent = addressParams && addressParams !== address;

    useEffect(() => {
        if (
            (address as `0x${string}`) &&
            portfolio.investedPools &&
            portfolio.investedPools.length > 0
        ) {
            const dataActiveInvestPools = portfolio.investedPools.filter(
                (item: IPool) => {
                    return (
                        item.status !== TOKEN_STATUS.FAIL &&
                        item.status !== TOKEN_STATUS.COMPLETED
                    );
                }
            );
            setActiveInvestPools(dataActiveInvestPools);
        }
    }, [portfolio.investedPools]);

    useEffect(() => {
        if (!(address as `0x${string}`) || !chainId || !addressParams) {
            setLoadingTableAsset(false);
            // resetGetInviteCode();
        }
    }, [address, addressParams]);

    const funcGenerateTableAsset = (
        innerClaimMap: Map<string, InvestPool>,
        pools: IPool[],
        analystData: {
            [key: string]: { id: string; analystData?: IAnalystData };
        }
    ): IAssetList[] => {
        const listAsset: IAssetList[] = pools
            .map((pool: IPool, index: number) => {
                const investPool = innerClaimMap.get(pool.id);

                if (investPool) {
                    return {
                        index,
                        id: pool.id,
                        symbolAndName: `${pool.symbol}/${pool.name}`,
                        currentPrice:
                            analystData[pool.id]?.analystData?.currentPrice,
                        time24h:
                            new BigNumber(pool.changePrice24h).toFixed(2) + '%',
                        bondAmount: formatCurrency(
                            new BigNumber(investPool.balance).toFixed(0)
                        ),
                        claimable:
                            parseFloat(investPool?.pendingClaimAmount) > 0
                                ? investPool?.pendingClaimAmount
                                : '-',
                        incentivesInfo:
                            parseFloat(investPool?.pendingRewardFarming) > 0
                                ? investPool?.pendingRewardFarming
                                : '-',
                        status: pool.status,
                        pendingClaimAmount: investPool.pendingClaimAmount
                    };
                }
                return undefined;
            })
            .filter(
                (item) =>
                    item !== undefined &&
                    parseFloat(item.bondAmount.replace(/,/g, '')) > 0
            ) as IAssetList[];

        return listAsset;
    };
    const listAsset: IAssetList[] = funcGenerateTableAsset(
        claimMap,
        activeInvestPools,
        poolStateList.analystData
    );

    const { useClaimToken } = useMultiCaller();

    useEffect(() => {
        if (useClaimToken.isLoadingInitClaimToken) {
            setIsLoadingClaimTokenOrSell(true);
            notification.info({
                message: 'Token in Progress',
                description: 'Please wait while your token is being processed',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useClaimToken.isLoadingInitClaimToken]);
    useEffect(() => {
        if (useClaimToken.isLoadingAgreedClaimToken) {
            setIsLoadingClaimTokenOrSell(false);
            notification.success({
                message: 'Claim token successfully!',
                // description: '',
                duration: 1.2,
                showProgress: true
            });
        }
    }, [useClaimToken.isLoadingAgreedClaimToken]);

    useEffect(() => {
        if (useClaimToken.isError) {
            setIsLoadingClaimTokenOrSell(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useClaimToken.isError]);

    const onHandleSellOrClaim = async (
        poolAddress: string,
        pendingClaimAmount: string
    ) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (parseFloat(pendingClaimAmount) > 0) {
            // case claim token
            if (!(chainId && address)) {
                notification.error({
                    message: 'Error',
                    description: t('PLEASE_CONNECT_WALLET'),
                    duration: 1,
                    showProgress: true
                });
                return;
            }
            await useClaimToken.actionAsync({ poolAddress });
        } else {
            // case sell token
            setIdCurrentChoosedTokenSell(poolAddress);
        }
    };

    const handleClickAddress = (addressPool: string) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${addressPool}`
        );
    };
    const baseColumns: ColumnsType<IAssetList> = [
        {
            title: t('SYMBOL/NAME'),
            dataIndex: 'symbolAndName',
            key: 'index',
            width: '5%',
            className: '!font-forza ',
            align: 'left',
            render: (_, record) => (
                <span
                    className="cursor-pointer text-blue-400"
                    onClick={() => handleClickAddress(record.id.toLowerCase())}
                >
                    {record.symbolAndName}
                </span>
            )
        },
        {
            title: t('CURRENT_PRICE'),
            className: '!font-forza ',
            align: 'center',
            dataIndex: 'currentPrice',
            width: '7%'
        },
        {
            title: t('24H(%)'),
            className: '!font-forza ',
            align: 'center',
            dataIndex: 'time24h',
            width: '7%'
        },
        {
            title: t('BOND_AMOUNT'),
            className: '!font-forza ',
            align: 'center',
            dataIndex: 'bondAmount',
            width: '7%'
        },
        {
            title: t('CLAIMABLE'),
            dataIndex: 'claimable',
            align: 'center',
            className: '!font-forza',
            width: '7%'
        },
        {
            title: t('INCENTIVES_INFO'),
            className: '!font-forza',
            align: 'center',
            dataIndex: 'incentivesInfo',
            width: '7%'
        }
    ];

    const actionColumn: ColumnsType<IAssetList> = !isAddressDifferent
        ? [
            {
                title: t('ACTION'),
                key: 'action',
                className: '!font-forza',
                align: 'center',
                width: '7%',
                render: (_, record) => (
                    <div className="">
                        <Button
                            size="large"
                            className={`w-[10%] w-fit !flex-1 text-nowrap !font-forza transition-opacity `}
                            disabled={Boolean(
                                (parseFloat(record.pendingClaimAmount) ===
                                    0 &&
                                    record.status !== TOKEN_STATUS.ACTIVE) ||
                                (addressParams &&
                                    addressParams !== address)
                            )}
                            style={{
                                backgroundColor:
                                    parseFloat(record.pendingClaimAmount) ===
                                        0 &&
                                        record.status !== TOKEN_STATUS.ACTIVE
                                        ? '#E0E0E0'
                                        : '#297fd6',
                                color:
                                    parseFloat(record.pendingClaimAmount) ===
                                        0 &&
                                        record.status !== TOKEN_STATUS.ACTIVE
                                        ? '#A6A6A6'
                                        : 'white'
                            }}
                            onClick={() =>
                                onHandleSellOrClaim(
                                    record.id,
                                    record.pendingClaimAmount
                                )
                            }
                        >
                            {parseFloat(record.pendingClaimAmount) > 0 ||
                                record.status !== TOKEN_STATUS.ACTIVE
                                ? 'Claim'
                                : 'Sell'}
                        </Button>
                    </div>
                )
            }
        ]
        : [];

    // Hợp nhất baseColumns và actionColumn
    const columns = baseColumns.concat(actionColumn);

    useEffect(() => {
        // Assuming data is fully fetched and set loading to false
        if (
            !loadingTableAsset &&
            Object.keys(claimMap).length === activeInvestPools.length
        ) {
            setLoadingTableAsset(false);
        }
    }, [claimMap, loadingTableAsset, activeInvestPools.length]);

    const handleClaimMapUpdate = (
        poolAddress: string,
        investPoolObj: InvestPool
    ) => {
        setClaimMap((prevClaimMap) => {
            const newClaimMap = new Map<string, InvestPool>(prevClaimMap);
            newClaimMap.set(poolAddress, investPoolObj);
            return newClaimMap;
        });
    };

    const handleLoadingTable = (isLoading: boolean) => {
        setLoadingTableAsset(isLoading);
    };

    const handleGenerateCode = async () => {
        try {
            const data = await serviceInviteCode.generateInviteCode();
            if (data) {
                notification.success({
                    message: 'Success',
                    // @ts-ignore
                    description: data.message,
                    duration: 3,
                    showProgress: true
                });

                // @ts-ignore
                await fetchGetInviteCode();
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description:
                    'Please try again because your balance is less than $500',
                duration: 3,
                showProgress: true
            });
        }
    };

    return (
        <div className="h-full w-full">
            {(address as `0x${string}`) &&
                activeInvestPools.map((item) => (
                    <Investpool
                        item={item}
                        onUpdateClaimMap={handleClaimMapUpdate}
                        onLoading={handleLoadingTable}
                        address={addressParams || address || ''}
                    />
                ))}

            <div className="!font-forza text-base font-bold">
                {t('PORTFOLIO')}
            </div>
            <div className="py-4">
                <p className="!font-forza text-base text-black">
                    {t('TOTAL_INVESTED')}:{' '}
                    {new BigNumber(totalInvestedETH).div(1e18).toFixed(10)}{' '}
                    {chainConfig?.currency}
                </p>

                <p className="!font-forza text-base text-black">
                    {t('ADDRESS')}:{' '}
                    {isMobile
                        ? shortWalletAddress(addressParams ? addressParams : '')
                        : addressParams}
                </p>

                {/* <ModalListCurrentCode /> */}
            </div>
            {/* {address && !isAddressDifferent && (
                <>
                    <div className="mt-2 !font-forza text-lg font-bold">
                        {t('CURRENT_CODE_INVITE')}
                    </div>
                    <div className="mb-2 mt-2">
                        <CurrentCodeInvite />
                    </div>
                </>
            )} */}

            {/* {address && !isAddressDifferent && (
                <>
                    <div className="mb-2 mt-2 !font-forza text-lg font-bold">
                        {t('INVITE_LIST_REFER')}
                    </div>

                    <div className="mb-2 mt-2">
                        <ListRefer />
                    </div>
                </>
            )} */}

            <div className="mt-3 !font-forza text-lg font-bold">
                {t('ASSET')}
            </div>
            <Spin
                spinning={loadingTableAsset}
                delay={0}
            >
                <Table
                    key={addressParams}
                    rowKey="index"
                    dataSource={(address as `0x${string}`) ? listAsset : []}
                    columns={columns}
                    bordered
                    className="!font-forza"
                    scroll={{ x: 300 }}
                />
            </Spin>
            <RecentTx userWalletAddress={addressParams?.toLowerCase()} />
        </div>
    );
};

export default Statistical;
