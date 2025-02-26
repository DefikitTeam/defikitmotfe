/* eslint-disable */
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import { markSlider } from '@/src/common/constant/constance';
import {
    calculateTimeLeft,
    currencyFormatter,
    divToDecimal,
    formatCurrency
} from '@/src/common/utils/utils';
import ModalSetMaxSlippage from '@/src/components/modal-set-max-slippage';
import { useConfig } from '@/src/hooks/useConfig';
import { useReader } from '@/src/hooks/useReader';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { RootState } from '@/src/stores';
import {
    useActivities,
    useBuyPoolInformation,
    usePoolDetail,
    useSlippage
} from '@/src/stores/pool/hook';
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import {
    Col,
    Form,
    Input,
    notification,
    Progress,
    Row,
    Slider,
    Tooltip,
    Typography
} from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import ModalActivities from './modal-activities';
import SaveButtonBuy from './save-button-buy';
import LotteryButtons from './lottery-button';
const { Text, Title } = Typography;

const PoolPurchaseSummary = () => {
    const t = useTranslations();
    const [{ poolStateDetail }, fetchPoolDetail, fetchPoolDetailBackground] =
        usePoolDetail();
    const { pool, analystData, priceNative, status } = poolStateDetail;
    const { chainId, address, isConnected } = useAccount();
    // const { address, isConnected } = useAccount();
    const params = useParams();
    const poolAddress = params?.poolAddress as string;
    const chainData = useSelector((state: RootState) => state.chainData);
    const [data, setData] = useBuyPoolInformation();
    const [maxBondCurrentValue, setMaxBondCurrentValue] = useState('0');
    const [bondAvailableCurrent, setBondAvailableCurrent] =
        useState<string>('0');
    const [bondingCurveProgress, setBondingCurveProgress] = useState('0');
    const [bondSold, setBondSold] = useState('0');
    const [isStart, setIsStart] = useState(false);
    const [maxRepeatPurchase, setMaxRepeatPurchase] = useState('0');
    const [maxAmountETH, setMaxAmountETH] = useState(0);

    const { chainConfig } = useConfig();
    const multiCallerContract = getContract(chainConfig?.chainId!);

    const [balanceOfUser, setBalanceOfUser] = useState('0');
    const [sliderPercent, setSliderPercent] = useState<number>(0);
    const [maxSlider, setMaxSlider] = useState(0);
    const [bondAmountValue, setBondAmountValue] = useState('');
    const [disableBtnBuy, setDisableBtnBuy] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [raisedEth, setRaisedEth] = useState('0');
    const [showInitial, setShowInitial] = useState('0');

    const [buyAmountBtn, setBuyAmountBtn] = useState('');
    const [isTradeBex, setIsTradeBex] = useState<boolean>(false);
    const { setOpenModalActiviti } = useActivities();
    const { slippageState, setOpenModalSettingSlippage } = useSlippage();
    const [validateInput, setValidateInput] = useState({
        bondAmount: {
            error: false,
            helperText: ''
        }
    });

    const handleOnChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        if (isNaN(Number(value)) || parseInt(value) === 0) {
            clearForm();
            return;
        }
        let validateInputError = false;
        let validateInputHelperText = '';

        if (value) {
            if (Number(value) > 100) {
                validateInputError = true;
                validateInputHelperText = t('MAXIMUM_BOND_AMOUNT');
            } else {
                validateInputError = false;
                validateInputHelperText = '';
            }

            setValidateInput({
                ...validateInput,
                bondAmount: {
                    error: validateInputError,
                    helperText: validateInputHelperText
                }
            });
            if (!validateInputError) {
                setData({
                    ...data,
                    [name]: Number(value)
                });
                setBondAmountValue(value.toString());
                const now = new Date();
                if (parseInt(pool?.startTime ?? '0') * 1000 > now.valueOf()) {
                    setDisableBtnBuy(true);
                } else {
                    setDisableBtnBuy(false);
                }
                setSliderPercent(Number(value));
            }
        } else {
            setDisableBtnBuy(true);
            setBuyAmountBtn('');
            setMaxAmountETH(0);
            setBondAmountValue('');
            setSliderPercent(0);
        }
    };

    const clearForm = () => {
        setDisableBtnBuy(true);
        setSliderPercent(0);
        setBuyAmountBtn('');
        setBondAmountValue('');
        setMaxAmountETH(0);
    };

    const debounceTimeoutRef = useRef<NodeJS.Timeout>();
    const handleChangeSlider = useCallback(
        (newValue: number | number[]) => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            const buyVolume = newValue as number;
            setSliderPercent(buyVolume);

            debounceTimeoutRef.current = setTimeout(() => {
                const now = new Date();
                setData({
                    ...data,
                    numberBatch: buyVolume
                });
                setBondAmountValue(buyVolume.toString());

                if (buyVolume > 0 && pool) {
                    if (parseInt(pool.startTime) * 1000 > now.valueOf()) {
                        setDisableBtnBuy(true);
                    } else {
                        setDisableBtnBuy(false);
                    }
                } else {
                    clearForm();
                }
            }, 300); // 300ms debounce delay
        },
        [pool, setData, clearForm]
    );

    const [endTime, setEndTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    if (!pool) return null;
    useEffect(() => {
        if (pool) {
            getPoolInformation();
            getUserPoolInfo(pool.id);
        }
    }, [pool.id, chainConfig?.chainId, status, pool.soldBatch, address]);

    const getUserPoolInfo = async (poolAddress: string) => {
        if (address) {
            const userPoolInfo = await servicePool.getUserPool({
                chainId: chainConfig?.chainId!,
                poolAddress: poolAddress,
                userAddress: address
            });
            if (userPoolInfo.ok) {
                const userPoolInforResponse = await userPoolInfo.json();
                const dataResponse =
                    userPoolInforResponse?.data?.userInPools ?? [];

                let balanceOfUserParam = '0';
                if (dataResponse && dataResponse.length > 0) {
                    balanceOfUserParam = dataResponse[0].batch;
                    setBalanceOfUser(balanceOfUserParam);
                }
            }
        }
    };

    const getPoolInformation = async () => {
        if (pool.id) {
            const currentTime = new Date();

            if (parseInt(pool.startTime) * 1000 > currentTime.valueOf()) {
                setDisableBtnBuy(true);
            }
            setData({
                ...data,
                poolAddress: pool.id
            });
            // setMaxSlider(Number(pool?.batchAvailable));
            const tokenForSale = new BigNumber(pool.tokenForSale);
            const totalBatch = new BigNumber(pool.totalBatch);
            const maxRepeatPurchase = tokenForSale
                .div(totalBatch)
                .div(10 ** parseInt(pool.decimals))
                .toFixed(7);
            setMaxRepeatPurchase(maxRepeatPurchase);
            const marketCap = new BigNumber(pool.raisedInETH).div(1e18);
            const raisedShow = marketCap.isEqualTo(0)
                ? `0`
                : marketCap.isLessThanOrEqualTo(0.001)
                    ? `<0.001`
                    : `${marketCap.toFixed(3)} ${chainConfig?.currency} - $${currencyFormatter(
                        marketCap.times(priceNative)
                    )}`;
            setRaisedEth(raisedShow);
            const bondingCurve = new BigNumber(pool.raisedInETH)
                .times(100)
                .div(pool.capInETH);
            setBondingCurveProgress(bondingCurve.toFixed(2));
            setBondSold(pool.soldBatch);
        }
    };

    const handleOpenActivities = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setOpenModalActiviti(true);
    };
    const handleOpenSlippage = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }
        setOpenModalSettingSlippage(true);
    };
    const handleKeyPress = (event: any) => {
        const pattern = /^[0-9]*$/;
        if (!pattern.test(event.key)) {
            event.preventDefault();
        }
    };

    const { dataReader, isFetchingDataReader, reFetchDataReader } = useReader({
        contractAddAndAbi: multiCallerContract,
        poolAddress: pool?.id as string,
        value: Number(bondAmountValue) >= 100 ? 100 : Number(bondAmountValue),
        chainId: chainConfig?.chainId as number
    });
    const estimateBuyValue = dataReader ? dataReader[2] : undefined;
    const maxBondCurrent = dataReader ? dataReader[4] : undefined;

    const estimateBuyValueReal = estimateBuyValue?.result;

    const kien: number = 1;

    const {
        dataReader: dataReader2,
        isFetchingDataReader: isFetchingDataReader2,
        reFetchDataReader: reFetchDataReader2
    } = useReader({
        contractAddAndAbi: multiCallerContract,
        poolAddress: pool?.id as string,
        value: kien,
        chainId: chainConfig?.chainId as number
    });

    const estimateBuyValue2 = dataReader2 ? dataReader2[2] : undefined;
    const estimateBuyValueReal2 = estimateBuyValue2?.result;

    useEffect(() => {
        // if(Number(new BigNumber(maxBondCurrent?.result).toString())=== Number(pool?.totalBatch)){
        //     return;
        // }

        reFetchDataReader();
    }, [pool?.soldBatch, pool?.batchAvailable, endTime.seconds]);

    useEffect(() => {
        // if(Number(new BigNumber(maxBondCurrent?.result).toString())=== Number(pool?.totalBatch)){
        //     return;
        // }

        reFetchDataReader2();
    }, [pool?.soldBatch, pool?.batchAvailable, endTime.seconds]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchPoolDetailBackground({
                page: poolStateDetail.pageTransaction,
                limit: poolStateDetail.limitTransaction,
                poolAddress: poolAddress,
                chainId: chainConfig?.chainId as number
            });
        }, 4000);
        return () => clearInterval(intervalId);
    }, [chainId, poolAddress]);

    useEffect(() => {
        const availableBonds = Number(maxBondCurrentValue);

        const validBonds =
            isNaN(availableBonds) || availableBonds < 0
                ? '0'
                : availableBonds.toString();

        setBondAvailableCurrent(validBonds);
        setMaxSlider(Number(validBonds));
    }, [maxBondCurrentValue]);

    useEffect(() => {
        const value: number =
            Number(sliderPercent) >= 100 ? 100 : Number(sliderPercent);
        setIsLoading(true);
        try {
            if (value) {
                if (isFetchingDataReader === false && estimateBuyValueReal) {
                    const estimateBuyRes = divToDecimal(
                        estimateBuyValueReal?.toString()
                    );

                    const ethToBuy: number =
                        slippageState.slippage !== 0
                            ? Number(
                                new BigNumber(estimateBuyValueReal)
                                    .times(1 + slippageState.slippage / 100)
                                    .toFixed(0)
                            )
                            : Number(estimateBuyValueReal);
                    setMaxAmountETH(ethToBuy);
                    setData({
                        ...data,
                        maxAmountETH: Number(ethToBuy)
                    });
                    setBuyAmountBtn(
                        `${parseFloat(maxRepeatPurchase) * value} ${pool?.symbol} ~ ${new BigNumber(estimateBuyRes).toFixed(6)} ${chainConfig?.currency}`
                    );
                }
            }
        } catch (error) {
            console.log('==== call estimate error: ', error);
        }
        setIsLoading(false);
    }, [
        isFetchingDataReader,
        estimateBuyValueReal,
        sliderPercent,
        slippageState.slippage
    ]);

    useEffect(() => {
        const value: number = 1;
        try {
            if (value) {
                if (isFetchingDataReader2 === false && estimateBuyValueReal2) {
                    const estimateBuyRes2 = divToDecimal(
                        estimateBuyValueReal2?.toString()
                    );

                    setShowInitial(
                        `${new BigNumber(estimateBuyRes2).toFixed(6)}`
                    );
                }
            }
        } catch (error) {
            console.log('==== call estimate error: ', error);
        }
    }, [isFetchingDataReader2, estimateBuyValueReal2]);

    useEffect(() => {
        try {
            if (isFetchingDataReader === false && maxBondCurrent) {
                setMaxBondCurrentValue(
                    new BigNumber(maxBondCurrent?.result).toString()
                );
            }
        } catch (error) {
            console.log('==== call getMaxBatchCurrent error: ', error);
        }
    }, [isFetchingDataReader, maxBondCurrent]);

    useEffect(() => {
        if (pool?.soldBatch === pool?.totalBatch) {
            setEndTime({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            });
            setIsTradeBex(true);
        }
    }, [pool?.soldBatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (pool && pool?.soldBatch != pool?.totalBatch) {
                const now = new Date();
                const startTime = new Date(parseInt(pool.startTime) * 1000);
                if (now.valueOf() < startTime.valueOf()) {
                    setIsStart(true);
                    setEndTime(calculateTimeLeft(pool.startTime));
                } else {
                    setIsStart(false);
                    setEndTime(calculateTimeLeft(pool.endTime));
                }
                setBondSold(pool.soldBatch);
            }
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="h-full w-full">
            <Form layout="vertical">
                <Row gutter={[0, 0]}>
                    <Col
                        xs={12}
                        sm={12}
                        lg={12}
                        md={12}
                        xxl={12}
                    >
                        <Form.Item
                            name="incentivePool"
                            label={
                                <span className="!font-forza text-base ">
                                    {t('INCENTIVE_POOL')}
                                </span>
                            }
                            className="mb-0 "
                            initialValue={`APY ${formatCurrency(
                                analystData.apy || '0'
                            )} %`}
                        >
                            <Input
                                size="large"
                                disabled={true}
                                className="!font-forza text-base"
                                style={{
                                    backgroundColor: '#CCCCCC',
                                    color: '#7E7E97'
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col
                        xs={12}
                        sm={12}
                        lg={12}
                        md={12}
                        xxl={12}
                    >
                        <div className="mb-0 pl-4">
                            <span className="!font-forza text-base">
                                {t('RAISED')} {`${chainConfig?.currency}`}
                            </span>
                            <Input
                                size="large"
                                disabled={true}
                                value={raisedEth}
                                className="!font-forza text-base"
                                style={{
                                    backgroundColor: '#CCCCCC',
                                    color: '#7E7E97'
                                }}
                            />
                        </div>
                    </Col>

                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className="py-2"
                    >
                        <span className="!font-forza text-base">
                            {t('BONDING_CURVE_PROGRESS')}:{' '}
                            <strong>
                                {' '}
                                {bondingCurveProgress}% ~ {bondSold}/
                                {pool.totalBatch}
                            </strong>
                        </span>

                        <Progress
                            style={{ width: '100%' }}
                            className=" font-forza !font-bold   "
                            strokeColor="##20C00F"
                            percentPosition={{ align: 'start', type: 'outer' }}
                            percent={parseFloat(bondingCurveProgress)}
                        />
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className="py-2"
                    >
                        <Title
                            level={4}
                            className=" text-center !font-bold"
                        >
                            {' '}
                            {isStart ? 'Start In' : 'End In'}
                        </Title>

                        <div className="flex justify-center space-x-2 !font-forza text-base font-bold">
                            <div className="flex w-[65px] flex-col items-center">
                                <div className="flex h-[35px] w-[30px] w-fit !flex-1 items-center justify-center text-nowrap rounded-lg border bg-pink-100 p-3 ">
                                    <Title
                                        level={5}
                                        className="text- w-fit !flex-1 text-nowrap"
                                    >
                                        {endTime.days}
                                    </Title>
                                </div>
                                <div className="">days</div>
                            </div>
                            <div className="flex w-[65px] flex-col items-center">
                                <div className="flex h-[35px] w-[30px] w-fit !flex-1 items-center justify-center text-nowrap rounded-lg border bg-pink-100 p-3">
                                    <Title
                                        level={5}
                                        className="w-fit !flex-1 text-nowrap"
                                    >
                                        {endTime.hours}
                                    </Title>
                                </div>
                                <div className="">hours</div>
                            </div>
                            <div className="flex w-[65px] flex-col items-center">
                                <div className="flex h-[35px] w-[30px] w-fit !flex-1 items-center justify-center text-nowrap rounded-lg border bg-pink-100 p-3">
                                    <Title
                                        level={5}
                                        className="w-fit !flex-1 text-nowrap text-center"
                                    >
                                        {endTime.minutes}
                                    </Title>
                                </div>
                                <div className="">minutes</div>
                            </div>
                            <div className="flex w-[65px] flex-col items-center">
                                <div className="flex h-[35px] w-[30px] w-fit !flex-1 items-center justify-center text-nowrap rounded-lg border bg-pink-100 p-3">
                                    <Title
                                        level={5}
                                        className="w-fit !flex-1 text-nowrap"
                                    >
                                        {endTime.seconds}
                                    </Title>
                                </div>
                                <div className="">seconds</div>
                            </div>
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className=" mb-0"
                    >
                        <div
                            className="cursor-pointer text-right font-forza text-base text-blue-400"
                            onClick={handleOpenActivities}
                        >
                            {t('YOUR_ACTIVITIES')}
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className=" mb-0 py-3 "
                    >
                        <div className="flex justify-between text-nowrap">
                            <div className="flex justify-between">
                                <div className="font-forza text-base ">
                                    {t('AMOUNT_PER_BOND')}
                                </div>

                                <div className="font-forza text-base ">
                                    {t('ESTIMATE_INITIAL')}
                                </div>
                            </div>

                            <div className="flex cursor-pointer justify-end">
                                <span className="mr-1 !font-forza text-base">
                                    {t('SLIPPAGE')}
                                </span>
                                <SettingOutlined
                                    className="!font-forza  text-lg font-bold"
                                    onClick={handleOpenSlippage}
                                />
                            </div>
                        </div>

                        <Input
                            size="large"
                            disabled={true}
                            value={`${maxRepeatPurchase} ${pool?.symbol} ~ ${showInitial} ${chainConfig?.currency}`}
                            className="!font-forza text-base"
                            style={{
                                backgroundColor: '#CCCCCC',
                                color: '#7E7E97'
                            }}
                        />
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <div className="mb-0">
                            <span className="!font-forza text-base">
                                <Text className="text-lg text-red-500">* </Text>
                                {t('BOND_AMOUNT')}
                                <Tooltip title={t('MAXIMUM_BOND_AMOUNT')}>
                                    <QuestionCircleOutlined
                                        style={{ marginLeft: '8px' }}
                                    />
                                </Tooltip>
                            </span>

                            <Input
                                type="number"
                                placeholder={t('ENTER_NUMBER_BOND')}
                                name="numberBatch"
                                max={maxSlider}
                                min={0}
                                // style={{ width: '100%' }}
                                value={bondAmountValue}
                                onKeyPress={handleKeyPress}
                                onChange={handleOnChange}
                                className="!font-forza text-base"
                                style={{ color: '#000000', width: '100%' }}
                            />
                            {validateInput.bondAmount.error === true && (
                                <Text className="text-red-500">
                                    {validateInput.bondAmount.helperText}
                                </Text>
                            )}
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className="mb-0 mt-0"
                    >
                        <div className="mt-1 text-right !font-forza text-base text-blue-400 ">
                            {t('YOUR_BALANCE')}: {balanceOfUser} {t('BONDS')}
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className="ml-1 mr-1 mt-4"
                    >
                        <Slider
                            // tooltip={{ open: true }}
                            // tooltipVisible={true}
                            autoFocus={true}
                            min={0}
                            max={
                                Number(bondAvailableCurrent) &&
                                    Number(bondAvailableCurrent) > 100
                                    ? 100
                                    : Number(bondAvailableCurrent)
                            }
                            marks={
                                parseInt(bondAvailableCurrent) >= 100
                                    ? markSlider
                                    : {}
                            }
                            onChange={handleChangeSlider}
                            value={
                                typeof sliderPercent === 'number'
                                    ? sliderPercent
                                    : 0
                            }
                        />
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                        className="mb-0 mt-0"
                    >
                        <div className="mt-1 text-right !font-forza text-base text-blue-400 ">
                            {t('BOND_AVAILABLE')}:{' '}
                            {Number(bondAvailableCurrent)} {t('BONDS')}
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <div className="mb-0">
                            <span className="!font-forza text-base">
                                {t('MAX_AMOUNT')} {`${chainConfig?.currency}`}
                            </span>

                            <Input
                                size="large"
                                disabled={true}
                                value={
                                    maxAmountETH
                                        ? new BigNumber(maxAmountETH)
                                            .div(1e18)
                                            .toFixed(6)
                                        : 0
                                }
                                className="!font-forza text-base"
                                style={{
                                    backgroundColor: '#CCCCCC',
                                    color: '#7E7E97'
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <SaveButtonBuy
                    text={buyAmountBtn}
                    isLoading={isLoading}
                    disableBtnBuy={disableBtnBuy}
                    clearForm={clearForm}
                    isTradeBex={isTradeBex}
                />
                <LotteryButtons />
            </Form>

            <ModalActivities />
            <ModalSetMaxSlippage type={'buy'} />
        </div>
    );
};
export default PoolPurchaseSummary;
