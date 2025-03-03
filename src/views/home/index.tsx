/* eslint-disable */
'use client';
import {
    ChainId,
    chains,
    DropdownObject,
    poolStates,
    PoolStatus,
    PoolStatusSortFilter,
    PoolStatusSortOrderBy
} from '@/src/common/constant/constance';

import BoxArea from '@/src/components/common/box-area';
import ModalInviteBlocker from '@/src/components/common/invite-blocker';
import SearchComponent from '@/src/components/common/search';
import EmptyPool from '@/src/components/empty';
import TopReferByVol from '@/src/components/top-refer-by-vol';
import { useConfig } from '@/src/hooks/useConfig';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { RootState } from '@/src/stores';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { useListPool } from '@/src/stores/pool/hook';
import { IPoolList } from '@/src/stores/pool/type';
import { useTopRefByVol } from '@/src/stores/top-ref-by-vol/hook';
import { EActionStatus } from '@/src/stores/type';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Col, Row, Select, Spin, Tooltip, Typography } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import ItemPool from './item-pool';
const { Option } = Select;
const { Text } = Typography;

interface KingOfTheHillProps {
    pool: IPoolList;
    metadata: any;
    analystData: any;
    priceNative: any;
    chainData: any;
    onPoolClick: (poolId: string) => void;
}

const KingOfTheHill = ({
    pool,
    metadata,
    analystData,
    priceNative,
    chainData,
    onPoolClick
}: KingOfTheHillProps) => {
    const [metadataShow, setMetadataShow] = useState<any>(null);

    const { chainConfig } = useConfig();
    useEffect(() => {
        if (metadata) {
            setMetadataShow(metadata);
        }
    }, [metadata]);
    if (!pool) {
        return null;
    }
    return (
        pool && (
            <div
                className={`relative mb-8 mt-4 flex justify-center overflow-y-auto overflow-x-hidden`}
            >
                <div className="w-full max-w-xl">
                    <div className="mb-4 animate-king-title text-center">
                        <Text
                            className={`animate-king-text !font-forza !text-2xl !font-extrabold tracking-wider ${chainConfig?.chainId === ChainId.MONAD}? 'text-purple-400': 'text-yellow-500'  `}
                        >
                            Rocket Pool
                        </Text>
                    </div>

                    <div
                        className={`pool-item max-h-[290px] animate-king-pool rounded-lg border-2 ${chainConfig?.chainId === ChainId.MONAD ? 'border-purple-400 bg-gradient-to-r from-purple-400/10 to-indigo-400/10' : 'border-yellow-500 bg-gradient-to-r from-yellow-500/10 to-amber-500/10'} p-1`}
                        // data-pool-id={pool.id}
                    >
                        <div
                            className="pool-item"
                            data-pool-id={pool.id}
                        >
                            <ItemPool
                                poolItem={pool}
                                className="transform transition-transform hover:scale-[1.02]"
                                metadata={
                                    metadataShow && metadataShow?.[pool.id]
                                        ? metadataShow[pool.id]
                                        : undefined
                                }
                                analysisData={
                                    analystData &&
                                    analystData[pool.id]?.analystData
                                }
                                priceNative={priceNative}
                                onClick={() => onPoolClick(pool.id)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

const HomePage = () => {
    const t = useTranslations();

    const {
        chainConfig,
        supportedChains,
        getContractAddress,
        isChainSupported,
        defaultChain,
        environment
    } = useConfig();

    // Check if current chain is supported

    const {
        poolStateList,
        getListPoolAction,
        getListPoolBackgroundAction,
        getMetadataPoolVisibleAction,
        setFilterAction,
        updateCalculatePoolAction,
        setOrderByAction,
        setOrderByDirectionAction
    } = useListPool();
    const {
        address,
        chainId,
        chain,
        isConnecting,
        isConnected,
        isDisconnected
    } = useAccount();

    const {
        analystData,
        metadata,
        priceNative,
        poolList,
        filter,
        focusPools,
        statusGetPoolListBackground,
        orderByDirection,
        orderBy
    } = poolStateList;

    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const listRef = useRef<HTMLDivElement | null>(null);
    const [allPool, setAllPool] = useState<IPoolList[]>([]);
    const chainData = useSelector((state: RootState) => state.chainData);
    const [poolState, setPoolState] = useState(PoolStatus.ACTIVE);
    const [query, setQuery] = useState('');
    const [repeat, setRepeat] = useState<boolean>(false);
    const { isMobile } = useWindowSize();
    const router = useRouter();
    const [stopInterval, setStopInterval] = useState<boolean>(false);
    const [kingPool, setKingPool] = useState<IPoolList | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [searchText, setSearchText] = useState('');
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [visiblePools, setVisiblePools] = useState<string[]>([]);
    const [metadataShow, setMetadataShow] = useState<any>(null);
    const currentPath = pathname?.split('/');
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();

    const getCurrentChainUrl = (): IChainInfor | undefined => {
        return chains.find(
            (item) =>
                item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
        );
    };

    const { value: refCodeExisted, setValue: setRefCodeExisted } =
        useRefCodeWatcher(REFCODE_INFO_STORAGE_KEY);

    // useEffect(() => {
    //     if (
    //         Boolean(authState.userInfo?.connectedWallet) &&
    //         Boolean(address) &&
    //         authState.userInfo?.connectedWallet === address
    //     ) {
    //         setOpenModalInviteBlocker(false);
    //         return;
    //     }

    //     if (!refCodeExisted) {
    //         setOpenModalInviteBlocker(true);
    //         disconnect();
    //     }
    // }, [refCodeExisted]);

    useEffect(() => {
        if (metadata) {
            setMetadataShow(metadata);
        }
    }, [metadata]);

    useEffect(() => {
        const handleScroll = () => {
            const listElement = listRef.current;

            if (!listElement) return;
            const listRect = listElement.getBoundingClientRect();
            const poolElements = Array.from(
                listElement.querySelectorAll('.pool-item')
            );

            poolElements.forEach((element) => {
                const poolElement = element as HTMLElement;
                const poolId = poolElement.getAttribute('data-pool-id');
                if (!poolId || visiblePools.includes(poolId)) return;

                const rect = poolElement.getBoundingClientRect();

                const listRect = listElement.getBoundingClientRect();

                const isVisible =
                    rect.top < listRect.bottom &&
                    rect.bottom > listRect.top &&
                    rect.top < listRect.bottom &&
                    rect.bottom > listRect.top;

                if (isVisible) {
                    const pool = allPool.find((item) => item.id === poolId);
                    if (pool && pool.metadata) {
                        getMetadataPoolVisibleAction({
                            id: poolId,
                            metadataLink: pool.metadata
                        });
                    }
                    setVisiblePools((prev) => [...prev, poolId]);
                }
            });
        };

        const listElement = listRef.current;
        if (listElement) {
            if (listElement.scrollHeight > listElement.clientHeight) {
                listElement.addEventListener('scroll', handleScroll);
                handleScroll();
                return () =>
                    listElement.removeEventListener('scroll', handleScroll);
            } else {
                handleScroll();
            }
        }
    }, [visiblePools, allPool, getMetadataPoolVisibleAction]);

    useEffect(() => {
        // localStorage.removeItem("wagmi.store");
        getListPoolAction({
            statusPool: filter,
            orderByDirection: orderByDirection,
            orderBy: orderBy,
            // chainId: chainData.chainData.chainId,
            chainId: chainConfig?.chainId!,
            metaDataFromStore: metadata,
            query: '',
            owner: address
        });

        setPoolState(filter);
    }, []);

    // useEffect(() => {
    //     const chainInfo = getCurrentChainUrl();
    //     // console.log('chainInfo')
    //     if (chainInfo) {
    //         dispatch(setChainData(chainInfo));
    //         switchChain({ chainId: chainInfo.chainId });
    //         // router.push(`${currentPath?.join('/')}?refId=${refId}`);
    //     }
    // }, [currentPath?.[2]]);

    useEffect(() => {
        if (!poolList && !priceNative) return;
        updateCalculatePoolAction({
            pools: poolList,
            priceNative: priceNative,
            metaDataFromStore: metadata
        });
    }, [priceNative, poolList]);

    useEffect(() => {
        if (poolStateList.poolList && poolStateList.poolList.length > 0) {
            const filteredPoolList = poolStateList.poolList;
            if (!isHovering) {
                setAllPool(filteredPoolList);
            }
        } else {
            setAllPool([]);
        }
    }, [poolStateList.poolList, isHovering]);

    useEffect(() => {
        setKingPool(null);
        setAllPool([]);
        fetchPoolList();
    }, [chainConfig?.chainId]);

    useEffect(() => {
        if (!allPool.length) {
            return;
        }

        if (focusPools.length > 0) {
            const kingPool = allPool.find((pool) =>
                focusPools.includes(pool.id)
            );
            setKingPool(kingPool || allPool[0]);
            return;
        }

        // Calculate king pool based on ratio
        const poolWithClosestRatio = allPool
            .map((pool) => ({
                pool,
                ratio: new BigNumber(pool.raisedInETH)
                    .div(new BigNumber(pool.capInETH))
                    .toNumber()
            }))
            .filter(
                (item) =>
                    !isNaN(item.ratio) &&
                    isFinite(item.ratio) &&
                    item.ratio > 0 &&
                    new BigNumber(item.pool.capInETH).gt(0)
            )
            .sort((a, b) => b.ratio - a.ratio)[0];

        setKingPool(poolWithClosestRatio?.pool || allPool[0]);
    }, [allPool, focusPools]);

    useEffect(() => {
        if (filter !== PoolStatus.ACTIVE || query) {
            fetchPoolList();
            return;
        }

        fetchPoolList();
        if (filter === PoolStatus.ACTIVE && !query) {
            const pollingInterval = setInterval(fetchPoolList, 5000);
            return () => clearInterval(pollingInterval);
        }
    }, [poolStateList.filter, chainConfig?.chainId, filter, query, address]);

    const fetchPoolList = () => {
        getListPoolBackgroundAction({
            statusPool: filter,
            query: query,
            owner: address,
            orderByDirection: orderByDirection,
            orderBy: orderBy,
            chainId: chainConfig?.chainId
        });
    };

    const handleInputChange = (value: string) => {
        setSearchText(value);
        if (!value || value.trim() === '') {
            handleClearSearch();
        }
    };

    const handleClickStartToken = () => {
        // if (isConnected && address) {
        router.push('/create-launch');
        // } else {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }
    };

    const handleSelectChange = (value: string) => {
        setPoolState(value as PoolStatus);
        switch (value) {
            case PoolStatus.MY_POOl:
                setFilterAction(PoolStatus.MY_POOl);
                break;
            case PoolStatus.ACTIVE:
                setFilterAction(PoolStatus.ACTIVE);
                break;
            case PoolStatus.UP_COMING:
                setFilterAction(PoolStatus.UP_COMING);
                break;
            case PoolStatus.All_POOL:
                setFilterAction(PoolStatus.All_POOL);
                break;
            // case PoolStatus.FULL:
            //     setFilterAction(PoolStatus.FULL);
            //     break;
            // case PoolStatus.FAIL:
            //     setFilterAction(PoolStatus.FAIL);
            //     break;
            // case PoolStatus.FINISHED:
            //     setFilterAction(PoolStatus.FINISHED);
            //     break;
            case PoolStatus.COMPLETED:
                setFilterAction(PoolStatus.COMPLETED);
                break;
            default:
                setFilterAction(PoolStatus.ACTIVE);
                break;
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleSearch = () => {
        // if (isConnected && address) {
        if (searchText.trim()) {
            const searchQuery = searchText.trim().toLowerCase();
            setQuery(searchQuery);
        }
        // } else {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }
    };

    const handleClearSearch = () => {
        setQuery('');
        setSearchText('');
    };

    const handleClickSortFilter = (value: string) => {
        // if (!isConnected || !address) {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }

        switch (filter) {
            case PoolStatus.MY_POOl:
                setOrderByAction(PoolStatusSortOrderBy.CREATE_TIMESTAMP);
                break;
            case PoolStatus.UP_COMING:
                setOrderByAction(PoolStatusSortOrderBy.CREATE_TIMESTAMP);
                break;
            case PoolStatus.ACTIVE:
                setOrderByAction(PoolStatusSortOrderBy.START_TIME);
                break;

            case PoolStatus.TRADING_VOLUME:
                setOrderByAction(PoolStatusSortOrderBy.TOTAL_VOLUME);
                break;
            case PoolStatus.MARKET_CAP:
                setOrderByAction(PoolStatusSortOrderBy.RAISED_IN_ETH);
                break;
            case PoolStatus.PRICE_24H:
                setOrderByAction(PoolStatusSortOrderBy.CHANGE_PRICE_24H);
                break;
            case PoolStatus.FULL:
                setOrderByAction(PoolStatusSortOrderBy.FULL_TIMESTAMP);
                break;
            case PoolStatus.FAIL:
                setOrderByAction(PoolStatusSortOrderBy.FAILED_TIMESTAMP);
                break;
            case PoolStatus.FINISHED:
                setOrderByAction(PoolStatusSortOrderBy.FULL_TIMESTAMP);
                break;
            case PoolStatus.COMPLETED:
                setOrderByAction(PoolStatusSortOrderBy.COMPLETED_TIMESTAMP);
                break;
            default:
                setOrderByAction(PoolStatusSortOrderBy.LATEST_TIMESTAMP_BUY);
                break;
        }
        setOrderByDirectionAction(value as PoolStatusSortFilter);
    };

    useEffect(() => {
        getListPoolAction({
            statusPool: filter,
            chainId: chainConfig?.chainId!,
            metaDataFromStore: metadata,
            query: '',
            owner: address,
            orderByDirection: orderByDirection,
            orderBy: orderBy
        });
    }, [filter, orderBy, orderByDirection]);

    useEffect(() => {
        if (poolStateList.poolList) {
            let sortedPoolList = [...poolStateList.poolList];
            sortedPoolList.sort((a, b) => {
                const orderByKey =
                    orderBy === 'createdTimestamp'
                        ? 'tgeTimestamp'
                        : orderBy === 'latestTimestamp'
                          ? 'latestTimestampBuy'
                          : orderBy;
                if (orderByDirection === PoolStatusSortFilter.ASC) {
                    return (a[orderByKey as keyof IPoolList] ?? 0) >
                        (b[orderByKey as keyof IPoolList] ?? 0)
                        ? 1
                        : -1;
                } else {
                    return (a[orderByKey as keyof IPoolList] ?? 0) <
                        (b[orderByKey as keyof IPoolList] ?? 0)
                        ? 1
                        : -1;
                }
            });
            setAllPool(sortedPoolList);
        }
    }, [poolStateList.poolList, orderBy, orderByDirection]);

    useEffect(() => {
        if (!allPool.length) {
            return;
        }

        // Your existing logic using `allPool`
    }, [allPool]);

    const handleClickPoolItem = (poolId: string) => {
        // if (!isConnected || !address) {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }

        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolId.toLowerCase()}`
        );
    };

    const handleOnPoolClick = (poolId: string) => {
        // if (!isConnected || !address) {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }

        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolId}`
        );
    };

    const {
        topRefByVolState,
        getAllTopRefByVolAction,
        resetStatusGetAllTopRefByVolAction
    } = useTopRefByVol();

    return (
        <BoxArea>
            <div
                className={`${
                    isMobile
                        ? 'mt-4 flex min-h-screen flex-col justify-end overflow-auto text-center'
                        : 'px-8 py-10 text-center'
                }`}
            >
                <Spin
                    spinning={poolStateList.status === EActionStatus.Pending}
                    delay={0}
                >
                    <div>
                        <Row gutter={[1, 1]}>
                            {!topRefByVolState.topRefByVols && (
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={24}
                                    md={24}
                                    xxl={24}
                                >
                                    {kingPool && (
                                        <KingOfTheHill
                                            pool={kingPool}
                                            metadata={metadataShow}
                                            analystData={analystData}
                                            priceNative={priceNative}
                                            chainData={chainData}
                                            onPoolClick={(poolId) =>
                                                handleOnPoolClick(poolId)
                                            }
                                        />
                                    )}
                                </Col>
                            )}
                            {!kingPool && (
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={24}
                                    md={24}
                                    xxl={24}
                                >
                                    <TopReferByVol />
                                </Col>
                            )}

                            {topRefByVolState.topRefByVols && (
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={12}
                                    md={24}
                                    xxl={12}
                                >
                                    {kingPool && (
                                        <KingOfTheHill
                                            pool={kingPool}
                                            metadata={metadataShow}
                                            analystData={analystData}
                                            priceNative={priceNative}
                                            chainData={chainData}
                                            onPoolClick={(poolId) =>
                                                handleOnPoolClick(poolId)
                                            }
                                        />
                                    )}
                                </Col>
                            )}

                            {kingPool && (
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={12}
                                    md={24}
                                    xxl={12}
                                >
                                    <TopReferByVol />
                                </Col>
                            )}
                        </Row>
                    </div>

                    <div
                        className={`${isMobile ? 'mt-5 w-full' : 'm-auto w-[40%]'} mt-5`}
                    >
                        <Text
                            className="drop-shadow-textShadow animate-blink cursor-pointer bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text !font-forza !text-xl !font-bold text-transparent"
                            // onClick={() => router.push('/create-launch')}
                            onClick={handleClickStartToken}
                        >
                            Start a Token/Launch
                        </Text>
                    </div>
                    <div
                        className={`${isMobile ? 'w-full' : 'm-auto w-[40%]'}`}
                    >
                        <div className="flex gap-2">
                            <SearchComponent
                                placeholder={t(
                                    'SEARCH_FOR_TOKEN_HERE_(NAME_OR_CONTRACT_ADDRESS_)'
                                )}
                                className="!mb-2 w-full !px-2 !font-forza"
                                onChange={handleInputChange}
                                onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                    if (
                                        e.key === 'Delete' ||
                                        e.key === 'Backspace'
                                    ) {
                                        const newValue = e.currentTarget.value;
                                        handleInputChange(newValue);
                                    }
                                }}
                                value={searchText}
                                onClear={handleClearSearch}
                            />
                            {query &&
                            statusGetPoolListBackground ===
                                EActionStatus.Pending ? (
                                <div className="relative">
                                    <button
                                        onClick={handleSearch}
                                        className="!mb-2 flex min-w-[100px] items-center justify-center rounded bg-gradient-to-r from-red-500 to-yellow-500 px-4 py-2 !font-forza text-white hover:opacity-90 disabled:opacity-70"
                                    >
                                        Search
                                    </button>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Spin
                                            delay={0}
                                            className="[&_.ant-spin-dot-item]:bg-white"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSearch}
                                    className="!mb-2 flex min-w-[100px] items-center justify-center rounded bg-gradient-to-r from-red-500 to-yellow-500 px-4 py-2 !font-forza text-white hover:opacity-90 disabled:opacity-70"
                                >
                                    Search
                                </button>
                            )}
                        </div>

                        <div className="mt-5 flex justify-center space-x-4">
                            <Select
                                className="h-10 bg-white !font-forza text-black"
                                style={{
                                    width: '130px',
                                    border: '1px solid darkgrey',
                                    borderRadius: '5px'
                                }}
                                placeholder={poolState}
                                onChange={handleSelectChange}
                            >
                                <Option
                                    value=""
                                    disabled
                                >
                                    <em>{poolState}</em>
                                </Option>

                                {address
                                    ? poolStates.map(
                                          (item: DropdownObject, key) => (
                                              <Option
                                                  className="!font-forza"
                                                  value={item.value}
                                                  key={key}
                                              >
                                                  {item.text}
                                              </Option>
                                          )
                                      )
                                    : poolStates
                                          .slice(1, 7)
                                          .map((item: DropdownObject, key) => (
                                              <Option
                                                  className="!font-forza"
                                                  value={item.value}
                                                  key={key}
                                              >
                                                  {item.text}
                                              </Option>
                                          ))}
                            </Select>

                            <div className="flex flex-col">
                                <Tooltip title={t('SORT_INCREASE')}>
                                    <CaretUpOutlined
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: '#000'
                                        }}
                                        onClick={() =>
                                            handleClickSortFilter(
                                                PoolStatusSortFilter.ASC
                                            )
                                        }
                                    />
                                </Tooltip>

                                <Tooltip title={t('SORT_DECREASE')}>
                                    <CaretDownOutlined
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: '#000'
                                        }}
                                        onClick={() =>
                                            handleClickSortFilter(
                                                PoolStatusSortFilter.DESC
                                            )
                                        }
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`listTokens mt-2 max-h-none overflow-y-auto overflow-x-hidden sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] xl:max-h-[80vh]`}
                        ref={listRef}
                    >
                        {/*<ClearCache />*/}
                        <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 xs:grid-cols-1 xxl:grid-cols-3 ">
                            {allPool.length === 0 && (
                                <div className="col-span-full">
                                    <EmptyPool />
                                </div>
                            )}
                            {allPool &&
                                allPool.length > 0 &&
                                allPool?.map((pool: IPoolList, index) => {
                                    return (
                                        <div
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            key={pool.id}
                                            className="contents"
                                        >
                                            <div
                                                className="pool-item"
                                                data-pool-id={pool.id}
                                            >
                                                <ItemPool
                                                    poolItem={pool}
                                                    onClick={() =>
                                                        handleClickPoolItem(
                                                            pool.id
                                                        )
                                                    }
                                                    className={`${
                                                        (index + 1) % 2 === 0
                                                            ? 'bg-evenColor'
                                                            : 'bg-oddColor'
                                                    }  ${index === 0 ? 'animate-newMessage' : ''}  `}
                                                    metadata={
                                                        metadataShow &&
                                                        metadataShow?.[pool.id]
                                                            ? metadataShow[
                                                                  pool.id
                                                              ]
                                                            : undefined
                                                    }
                                                    analysisData={
                                                        (analystData &&
                                                            analystData[pool.id]
                                                                ?.analystData) ||
                                                        undefined
                                                    }
                                                    priceNative={priceNative}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </Spin>
                <ModalInviteBlocker />
            </div>
        </BoxArea>
    );
};

export default HomePage;
