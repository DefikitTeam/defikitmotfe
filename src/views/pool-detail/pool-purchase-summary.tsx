'use client';

/* eslint-disable */
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import { PoolStatus } from '@/src/common/constant/constance';
import {
  calculateTimeLeft,
  currencyFormatter,
  divToDecimal,
  formatCurrency,
  isValidEtherInput
} from '@/src/common/utils/utils';
import ModalSetMaxSlippage from '@/src/components/modal-set-max-slippage';
import { useConfig } from '@/src/hooks/useConfig';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import { useReader } from '@/src/hooks/useReader';
import servicePool from '@/src/services/external-services/backend-server/pool';
import {
  useActivities,
  useBuyPoolInformation,
  useDepositLottery,
  usePoolDetail,
  useSlippage
} from '@/src/stores/pool/hooks';
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Progress,
  Row,
  Tooltip,
  Typography
} from 'antd';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import DepositLotteryButton from './deposit-lottery-button';
import ModalActivities from './modal-activities';
import SaveButtonBuy from './save-button-buy';
import SpinLotteryButton from './spin-lottery-button';
const { Text, Title } = Typography;

const PoolPurchaseSummary = () => {
  const t = useTranslations();
  const [{ poolStateDetail }, fetchPoolDetail, fetchPoolDetailBackground] =
    usePoolDetail();
  const { pool, analystData, priceNative, status } = poolStateDetail;

  const { chainId, address, isConnected } = useAccount();
  const { chainConfig } = useConfig();

  const { data: balanceData } = useBalance({
    address: address,
    chainId: chainConfig?.chainId
  });

  const reserveMin = chainConfig?.reserve_min;

  const userNativeBalance = Number(balanceData?.formatted ?? 0);

  const params = useParams();
  const poolAddress = params?.poolAddress as string;
  const [data, setData] = useBuyPoolInformation();
  const [dataDeposit, setDepositLotteryInformation] = useDepositLottery();
  const [maxBondCurrentValue, setMaxBondCurrentValue] = useState('0');
  const [funLotteryAvailable, setFunLotteryAvailable] = useState('0');
  const [bondAvailableCurrent, setBondAvailableCurrent] = useState<string>('0');
  const [bondingCurveProgress, setBondingCurveProgress] = useState('0');
  const [bondSold, setBondSold] = useState('0');
  const [isStart, setIsStart] = useState(false);
  const [maxRepeatPurchase, setMaxRepeatPurchase] = useState('0');
  const [maxAmountETH, setMaxAmountETH] = useState(0);

  const multiCallerContract = getContract(chainConfig?.chainId!);

  const [balanceOfUser, setBalanceOfUser] = useState('0');
  const [sliderPercent, setSliderPercent] = useState<number>(0);
  const [maxSlider, setMaxSlider] = useState(0);
  const [bondAmountValue, setBondAmountValue] = useState('');
  const [beraAmountValue, setBeraAmountValue] = useState('');
  const [estimatedBonds, setEstimatedBonds] = useState('0');
  const [depositBeraAmount, setDepositBeraAmount] = useState('0');
  const [depositAmountValue, setDepositAmountValue] = useState('');
  const [disableBtnBuy, setDisableBtnBuy] = useState(true);
  const [disableBtnDeposit, setDisableBtnDeposit] = useState(true);
  const [disableBtnSpin, setDisableBtnSpin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [raisedEth, setRaisedEth] = useState('0');
  const [showInitial, setShowInitial] = useState('0');

  const [buyButtonText, setBuyButtonText] = useState(() => t('BUY'));
  const [buyAmountBtn, setBuyAmountBtn] = useState('');
  const [isTradeBex, setIsTradeBex] = useState<boolean>(false);
  const { setOpenModalActiviti } = useActivities();
  const { slippageState, setOpenModalSettingSlippage } = useSlippage();

  const slippage = slippageState.slippage;

  const [batchReceivedMin, setBatchReceivedMin] = useState<string>('');

  const [validateInput, setValidateInput] = useState({
    amountBera: {
      error: false,
      helperText: ''
    }
  });

  const [userLotteryFunds, setUserLotteryFunds] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [disableBtnWithdraw, setDisableBtnWithdraw] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const {
    dataReader: userLotteryData,
    isFetchingDataReader: isFetchingUserLotteryData,
    reFetchDataReader: reFetchUserLotteryData
  } = useReader({
    contractAddAndAbi: multiCallerContract,
    poolAddress: pool?.id as string,
    userAddress: address as `0x${string}`,
    chainId: chainConfig?.chainId as number
  });

  const userLottery = userLotteryData ? userLotteryData[8] : undefined;
  const userLotteryValue = userLottery?.result;

  useEffect(() => {
    if (isFetchingUserLotteryData === false && userLotteryValue) {
      const ethAmountValue = userLotteryValue.ethAmount;
      const lotteryAmount = new BigNumber(ethAmountValue.toString())
        .div(1e18)
        .toFixed(6);
      setUserLotteryFunds(
        parseFloat(lotteryAmount) > 0 ? lotteryAmount.toString() : '0'
      );
    }
  }, [userLotteryValue, isFetchingUserLotteryData]);

  const { useWithdrawFundLottery } = useMultiCaller();

  const handleKeyPressDeposit = (event: any) => {
    const pattern = /^[0-9.]$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleOnChangeDeposit = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setDepositAmountValue(value.toString());
    // setDisableBtnDeposit(false);
    setDepositLotteryInformation({
      ...dataDeposit,
      [name]: Number(value)
    });
  };

  useEffect(() => {
    if (!dataDeposit.depositAmount) {
      setDisableBtnDeposit(true);
    } else {
      setDisableBtnDeposit(false);
    }
  }, [dataDeposit.depositAmount]);

  const validateAndSetAmount = (value: string) => {
    if (value === '') {
      setBeraAmountValue('');
      clearForm();
      setDisableBtnBuy(true);
      setBuyButtonText(t('BUY'));
      return;
    }

    if (isNaN(Number(value)) || Number(value) < 0) {
      clearForm();
      setDisableBtnBuy(true);
      setBuyButtonText(t('BUY'));
      return;
    }

    let validateInputError = false;
    let validateInputHelperText = '';

    if (parseFloat(value) > userNativeBalance) {
      validateInputError = true;
      validateInputHelperText = t('NOT_ENOUGH_BALANCE', {
        currentBalance: userNativeBalance.toFixed(3),
        currency: chainConfig?.currency
      });
    }

    setValidateInput({
      ...validateInput,
      amountBera: {
        error: validateInputError,
        helperText: validateInputHelperText
      }
    });

    if (!validateInputError) {
      setData({
        ...data,
        amountBera: value.toString().trim()
      });

      setBeraAmountValue(value.toString());

      const now = new Date();
      if (parseInt(pool?.startTime ?? '0') * 1000 > now.valueOf()) {
        setDisableBtnBuy(true);
      } else {
        setDisableBtnBuy(false);
      }
      setSliderPercent(Number(value));

      if (Number(value) > Number(bondAvailableCurrent)) {
        setBuyButtonText(t('BUY_AND_DEPOSIT_LOTTERY'));
      } else {
        setBuyButtonText(t('BUY'));
      }
    } else {
      setDisableBtnBuy(true);
      setBuyButtonText(t('BUY'));
    }
  };

  // const handleOnChange = (
  //     event:
  //         | React.ChangeEvent<HTMLInputElement>
  //         | React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //     const { name, value } = event.target;

  //     if (value === '') {
  //         setBeraAmountValue('');
  //         clearForm();
  //         return;
  //     }

  //     if (isNaN(Number(value)) || Number(value) < 0) {
  //         clearForm();
  //         return;
  //     }
  //     let validateInputError = false;
  //     let validateInputHelperText = '';

  //     if (value) {
  //         if (parseFloat(value) > userNativeBalance) {
  //             validateInputError = true;
  //             validateInputHelperText = t('NOT_ENOUGH_BALANCE', {
  //                 currentBalance: userNativeBalance.toFixed(3),
  //                 currency: chainConfig?.currency
  //             });
  //         }

  //         setValidateInput({
  //             ...validateInput,
  //             amountBera: {
  //                 error: validateInputError,
  //                 helperText: validateInputHelperText
  //             }
  //         });

  //         if (!validateInputError) {
  //             setData({
  //                 ...data,
  //                 amountBera: value.toString().trim()
  //             });

  //             setBeraAmountValue(value.toString());

  //             const now = new Date();
  //             if (parseInt(pool?.startTime ?? '0') * 1000 > now.valueOf()) {
  //                 setDisableBtnBuy(true);
  //             } else {
  //                 setDisableBtnBuy(false);
  //             }
  //             setSliderPercent(Number(value));

  //             if (Number(value) > Number(bondAvailableCurrent)) {
  //                 setBuyButtonText(t('BUY_AND_DEPOSIT_LOTTERY'));
  //             } else {
  //                 setBuyButtonText(t('BUY'));
  //             }
  //         }
  //     } else {
  //         setDisableBtnBuy(true);
  //         setBuyAmountBtn('');
  //         setMaxAmountETH(0);
  //         setBondAmountValue('');
  //         setSliderPercent(0);
  //         setBuyButtonText(t('BUY'));
  //     }
  // };

  const handleOnChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    validateAndSetAmount(value);
  };

  const clearForm = () => {
    setDisableBtnBuy(true);
    setSliderPercent(0);
    setBuyAmountBtn('');
    setBondAmountValue('');
    setMaxAmountETH(0);
    setBuyButtonText(t('BUY'));
  };

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  // const handleChangeSlider = useCallback(
  //     (newValue: number | number[]) => {
  //         if (debounceTimeoutRef.current) {
  //             clearTimeout(debounceTimeoutRef.current);
  //         }

  //         const buyVolume = newValue as number;
  //         setSliderPercent(buyVolume);

  //         debounceTimeoutRef.current = setTimeout(() => {
  //             const now = new Date();
  //             setData({
  //                 ...data,
  //                 numberBatch: buyVolume
  //             });
  //             setBondAmountValue(buyVolume.toString());

  //             if (buyVolume > 0 && pool) {
  //                 if (parseInt(pool.startTime) * 1000 > now.valueOf()) {
  //                     setDisableBtnBuy(true);
  //                 } else {
  //                     setDisableBtnBuy(false);
  //                 }
  //             } else {
  //                 clearForm();
  //             }
  //         }, 300); // 300ms debounce delay
  //     },
  //     [pool, setData, clearForm]
  // );

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
      // getUserLotteryFunds();
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
        const dataResponse = userPoolInforResponse?.data?.userInPools ?? [];

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

      setDepositLotteryInformation({
        ...dataDeposit,
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
    const pattern = /^[0-9.]$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  };

  const { dataReader, isFetchingDataReader, reFetchDataReader } = useReader({
    contractAddAndAbi: multiCallerContract,
    poolAddress: pool?.id as string,
    value: Number(bondAmountValue),
    chainId: chainConfig?.chainId as number
  });

  const estimateBuyValue = dataReader ? dataReader[2] : undefined;
  const maxBondCurrent = dataReader ? dataReader[4] : undefined;
  const funLottery = dataReader ? dataReader[7] : undefined;

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

  const {
    dataReader: dataReaderBera,
    isFetchingDataReader: isFetchingDataReaderBera,
    reFetchDataReader: reFetchDataReaderBera
  } = useReader({
    contractAddAndAbi: multiCallerContract,
    poolAddress: pool?.id as string,
    amountBera:
      beraAmountValue && isValidEtherInput(beraAmountValue)
        ? ethers.parseEther(beraAmountValue).toString()
        : undefined,
    chainId: chainConfig?.chainId as number
  });

  const estimateBuyWithBeraValue = dataReaderBera
    ? dataReaderBera[9]
    : undefined;

  const estimateBuyWithBeraValueReal = estimateBuyWithBeraValue?.result;

  // console.log('estimateBuyWithBeraValue line 523---', estimateBuyWithBeraValue)
  // console.log('estimateBuyWithBeraValueReal line 526---', estimateBuyWithBeraValueReal)
  // const [batchesReceivable, beraDepositAmount] = estimateBuyWithBeraValueReal || [];
  // console.log('batchesReceivable:', batchesReceivable?.toString());
  // console.log('beraDepositAmount:', beraDepositAmount?.toString());

  useEffect(() => {
    reFetchDataReader();
    reFetchDataReaderBera();
  }, [pool?.soldBatch, pool?.batchAvailable, endTime.seconds]);

  useEffect(() => {
    reFetchDataReader2();
  }, [pool?.soldBatch, pool?.batchAvailable, endTime.seconds]);

  useEffect(() => {
    reFetchUserLotteryData();
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
    const value: number = Number(sliderPercent);
    setIsLoading(true);
    try {
      if (value) {
        if (isFetchingDataReader === false && estimateBuyValueReal) {
          const estimateBuyRes = divToDecimal(estimateBuyValueReal?.toString());

          const ethToBuy: number =
            slippageState.slippage !== 0
              ? Number(
                new BigNumber(estimateBuyValueReal)
                  .times(1 + slippageState.slippage / 100)
                  .toFixed(0)
              )
              : Number(estimateBuyValueReal);
          setMaxAmountETH(ethToBuy);

          // setData({
          //     ...data,
          //     maxAmountETH: Number(ethToBuy)
          // });

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

          setShowInitial(`${new BigNumber(estimateBuyRes2).toFixed(6)}`);
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
    try {
      if (!isFetchingDataReader && funLottery) {
        const lotteryAmount = new BigNumber(funLottery?.result)
          .div(1e18)
          .toFixed(3);

        setFunLotteryAvailable(
          parseFloat(lotteryAmount) > 0 ? lotteryAmount.toString() : '0'
        );
      }
    } catch (error) {
      console.log('==== call funLottery error: ', error);
    }
  }, [isFetchingDataReader, funLottery]);

  useEffect(() => {
    try {
      if (!isFetchingDataReaderBera && estimateBuyWithBeraValueReal) {
        const [batchesReceivable, beraDepositAmount] =
          estimateBuyWithBeraValueReal || [];
        const estimatedBondsValue = new BigNumber(batchesReceivable).toString();

        const depositBeraAmountValue = new BigNumber(beraDepositAmount)
          .div(1e18)
          .toFixed(6);

        setEstimatedBonds(estimatedBondsValue);
        setDepositBeraAmount(depositBeraAmountValue);
      }
    } catch (error) {
      console.log('==== call estimateBuyWithBera error: ', error);
    }
  }, [isFetchingDataReaderBera, estimateBuyWithBeraValueReal]);

  useEffect(() => {
    const batchesReceivable = Number(estimatedBonds);
    if (batchesReceivable === 0) {
      setBatchReceivedMin('0');
    }
    if (batchesReceivable === 1) {
      setBatchReceivedMin('1');
    }
    if (batchesReceivable > 1) {
      const value = Math.floor(
        (batchesReceivable * (100 - slippageState.slippage)) / 100
      );
      setBatchReceivedMin(value.toString());
    }
  }, [estimatedBonds, slippageState.slippage]);

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

  useEffect(() => {
    if (useWithdrawFundLottery.isConfirmed) {
      notification.success({
        message: 'Success',
        description: `Successfully withdrew ${withdrawAmount} ${chainConfig?.currency}`,
        duration: 3,
        showProgress: true
      });
    }
  }, [useWithdrawFundLottery.isConfirmed]);

  // const funLotteryAvailableFake = 3;
  // const bondAvailableCurrentFake = 4;
  const currentTime = new Date();

  const isForceShowBuyButton =
    (parseInt(pool.endTime) * 1000 < currentTime.valueOf() &&
      Number(pool.batchAvailable) > 0) ||
    (Number(pool.batchAvailable) === 0 &&
      Number(pool.soldBatch) === Number(pool.totalBatch));

  const shouldShowDeposit =
    pool.status !== PoolStatus.FAIL &&
    pool.status !== PoolStatus.COMPLETED &&
    ((!isForceShowBuyButton && Number(funLotteryAvailable) > 0) ||
      Number(bondAvailableCurrent) === 0);

  const shouldShowSpin =
    pool.status !== PoolStatus.FAIL &&
    pool.status !== PoolStatus.COMPLETED &&
    !isForceShowBuyButton &&
    Number(funLotteryAvailable) > 0 &&
    Number(bondAvailableCurrent) > 0;

  const shouldShowBuyButton =
    pool.status !== PoolStatus.FAIL &&
    (isForceShowBuyButton || (!shouldShowDeposit && !shouldShowSpin));

  const handleKeyPressWithdraw = (event: any) => {
    const pattern = /^[0-9.]$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleOnChangeWithdraw = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setWithdrawAmount(value.toString());
    setDisableBtnWithdraw(
      !value || Number(value) <= 0 || Number(value) > Number(userLotteryFunds)
    );
  };

  const withdrawLotteryFunds = async () => {
    if (!address || !isConnected || !withdrawAmount) {
      notification.error({
        message: 'Error',
        description:
          'Please connect your wallet and enter an amount to withdraw',
        duration: 3,
        showProgress: true
      });
      return;
    }

    try {
      setIsWithdrawing(true);

      const amountInWei = ethers.parseEther(withdrawAmount).toString();

      await useWithdrawFundLottery.actionAsync({
        poolAddress: pool.id,
        amountETH: amountInWei
      });

      // Reset input
      setWithdrawAmount('');
    } catch (error) {
      console.error('Error withdrawing lottery funds:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to withdraw lottery funds',
        duration: 3,
        showProgress: true
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

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
              initialValue={`APY ${formatCurrency(analystData.apy || '0')} %`}
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
                {bondingCurveProgress}% ~ {bondSold}/{pool.totalBatch}
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

          {pool.status != PoolStatus.FAIL &&
            pool.status != PoolStatus.COMPLETED &&
            !shouldShowDeposit && (
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
                    {t('NATIVE_TOKEN_AMOUNT', {
                      currency: chainConfig?.currency
                    })}
                    <Tooltip
                      title={`Enter the amount of BERA you want to use to purchase. Your current balance: ${userNativeBalance.toFixed(3)} ${chainConfig?.currency}.`}
                    >
                      <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
                    </Tooltip>
                  </span>

                  <Input
                    placeholder={t('ENTER_NUMBER_NATIVE_TOKEN', {
                      currency: chainConfig?.currency
                    })}
                    name="amountBera"
                    value={beraAmountValue}
                    onKeyPress={handleKeyPress}
                    onChange={handleOnChange}
                    className="!font-forza text-base"
                    style={{
                      color: '#000000',
                      width: '100%'
                    }}
                  />
                  <div className="mt-2 flex gap-2">
                    {[25, 50, 75].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        className={`rounded-full border-2 border-orange-400 px-4 py-1 font-bold text-orange-400 transition-colors hover:bg-orange-100 ${beraAmountValue ===
                          ((userNativeBalance * percent) / 100).toFixed(6)
                          ? 'border-0 bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                          : ''
                          }`}
                        onClick={() => {
                          const val = (
                            (userNativeBalance * percent) /
                            100
                          ).toFixed(6);
                          validateAndSetAmount(val);
                          setBeraAmountValue(val);
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`rounded-full border-2 border-orange-400 px-4 py-1 font-bold text-orange-400 transition-colors hover:bg-orange-100 ${beraAmountValue ===
                        Math.max(
                          0,
                          userNativeBalance - (reserveMin || 0)
                        ).toFixed(6)
                        ? 'border-0 bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                        : ''
                        }
                                                `}
                      onClick={() => {
                        const val = Math.max(
                          0,
                          userNativeBalance - (reserveMin || 0)
                        ).toFixed(6);
                        validateAndSetAmount(val);
                        setBeraAmountValue(val);
                      }}
                    >
                      Max
                    </button>
                  </div>

                  {validateInput.amountBera.error === true && (
                    <Text className="text-red-500">
                      {validateInput.amountBera.helperText}
                    </Text>
                  )}

                  {beraAmountValue && (
                    <div className="mt-2 text-right !font-forza text-base text-blue-400">
                      {t('ESTIMATED_BONDS')}: {estimatedBonds} {t('BONDS')}
                    </div>
                  )}

                  {beraAmountValue && (
                    <div className="mt-2 text-right !font-forza text-base text-blue-400">
                      {t('DEPOSIT_BERA_AMOUNT')}: {depositBeraAmount}{' '}
                      {t(`${chainConfig?.currency}`)}
                    </div>
                  )}
                </div>
              </Col>
            )}

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

          {/* <Col
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
                    </Col> */}

          {pool.status != PoolStatus.FAIL &&
            pool.status != PoolStatus.COMPLETED && (
              <Col
                xs={24}
                sm={24}
                lg={24}
                md={24}
                xxl={24}
                className="mb-0 mt-0"
              >
                <Row
                  gutter={[16, 12]}
                  className="mb-6 rounded-lg bg-gray-50 p-2 shadow-md"
                  justify="space-between"
                >
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xxl={12}
                    className="flex items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-forza text-base">
                        {t('BOND_AVAILABLE')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {Number(bondAvailableCurrent)} {t('BONDS')}
                      </span>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xxl={12}
                    className="flex items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-forza text-base">
                        {t('FUND_LOTTERY_AVAILABLE')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {Number(funLotteryAvailable)}{' '}
                        {`${chainConfig?.currency}`}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
            )}

          {pool.status != PoolStatus.FAIL &&
            pool.status != PoolStatus.COMPLETED &&
            isConnected && (
              <Col
                xs={24}
                sm={24}
                lg={24}
                md={24}
                xxl={24}
                className="mb-6"
              >
                <Row
                  gutter={[16, 12]}
                  className="rounded-lg bg-gray-50 p-2 shadow-md"
                  justify="space-between"
                >
                  <Col
                    span={24}
                    className="flex items-center"
                  >
                    <div className="flex w-full flex-col">
                      <span className="font-forza text-base">
                        {t('YOUR_LOTTERY_FUNDS')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {Number(userLotteryFunds)} {`${chainConfig?.currency}`}
                      </span>
                    </div>
                  </Col>

                  {Number(userLotteryFunds) > 0 && (
                    <>
                      <Col
                        span={24}
                        className="mt-2"
                      >
                        <div className="mb-0">
                          <span className="!font-forza text-base">
                            <Text className="text-lg text-red-500">* </Text>
                            {`${t('WITHDRAW_AMOUNT')} ${chainConfig?.currency}`}
                          </span>
                          <Input
                            type="text"
                            placeholder={`Please enter ${chainConfig?.currency} amount to withdraw`}
                            name="withdrawAmount"
                            value={withdrawAmount}
                            onKeyPress={handleKeyPressWithdraw}
                            onChange={handleOnChangeWithdraw}
                            className="!font-forza text-base"
                            style={{
                              color: '#000000',
                              width: '100%'
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="mt-2"
                      >
                        <Button
                          type="primary"
                          className="h-auto w-full bg-blue-600 py-2 !font-forza text-base text-white hover:bg-blue-700"
                          onClick={withdrawLotteryFunds}
                          style={{
                            wordWrap: 'break-word',
                            opacity:
                              disableBtnWithdraw ||
                                useWithdrawFundLottery.isLoadingInitWithdrawFundLottery ||
                                useWithdrawFundLottery.isLoadingAgreedWithdrawFundLottery
                                ? 0.6
                                : 1
                          }}
                          disabled={
                            disableBtnWithdraw ||
                            useWithdrawFundLottery.isLoadingInitWithdrawFundLottery ||
                            useWithdrawFundLottery.isLoadingAgreedWithdrawFundLottery
                          }
                          loading={
                            isWithdrawing ||
                            useWithdrawFundLottery.isLoadingInitWithdrawFundLottery ||
                            useWithdrawFundLottery.isLoadingAgreedWithdrawFundLottery
                          }
                        >
                          {t('WITHDRAW_LOTTERY_FUNDS')}
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            )}

          {/* {pool.status != PoolStatus.FAIL &&
                        pool.status != PoolStatus.COMPLETED &&
                        shouldShowBuyButton && (
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <div className="mb-0">
                                    <span className="!font-forza text-base">
                                        {t('MAX_AMOUNT')}{' '}
                                        {`${chainConfig?.currency}`}
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
                        )} */}

          {pool.status != PoolStatus.FAIL &&
            pool.status != PoolStatus.COMPLETED &&
            shouldShowDeposit && (
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
                    {`${t('DEPOSIT_AMOUNT')} ${chainConfig?.currency}`}
                  </span>

                  <Input
                    type="text"
                    placeholder={`Please enter ${chainConfig?.currency} amount`}
                    name="depositAmount"
                    value={depositAmountValue}
                    onKeyPress={handleKeyPressDeposit}
                    onChange={handleOnChangeDeposit}
                    className="!font-forza text-base"
                    style={{
                      color: '#000000',
                      width: '100%'
                    }}
                  />
                  <div className="mt-2 flex gap-2">
                    {[25, 50, 75].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        className={`rounded-full border-2 border-orange-400 px-4 py-1 font-bold text-orange-400 transition-colors hover:bg-orange-100 ${depositAmountValue ===
                          ((userNativeBalance * percent) / 100).toFixed(6)
                          ? 'border-0 bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                          : ''
                          }`}
                        onClick={() => {
                          const val = (
                            (userNativeBalance * percent) /
                            100
                          ).toFixed(6);
                          setDepositAmountValue(val);
                          setDepositLotteryInformation({
                            ...dataDeposit,
                            depositAmount: Number(val)
                          });
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`rounded-full border-2 border-orange-400 px-4 py-1 font-bold text-orange-400 transition-colors hover:bg-orange-100 ${depositAmountValue ===
                        Math.max(
                          0,
                          userNativeBalance - (reserveMin || 0)
                        ).toFixed(6)
                        ? 'border-0 bg-gradient-to-r from-pink-500 to-orange-400 text-white'
                        : ''
                        }}
                                               `}
                      onClick={() => {
                        const val = Math.max(
                          0,
                          userNativeBalance - (reserveMin || 0)
                        ).toFixed(6);
                        setDepositAmountValue(val);
                        setDepositLotteryInformation({
                          ...dataDeposit,
                          depositAmount: Number(val)
                        });
                      }}
                    >
                      Max
                    </button>
                  </div>
                </div>
              </Col>
            )}
        </Row>

        <Row
          gutter={[16, 16]}
          className="mb-4"
        >
          <Col
            xs={24}
            sm={24}
            lg={24}
            md={24}
            xxl={24}
            className="mb-0"
          >
            {shouldShowBuyButton ? (
              <SaveButtonBuy
                text={buyAmountBtn}
                label={buyButtonText}
                isLoading={isLoading}
                disableBtnBuy={disableBtnBuy}
                clearForm={clearForm}
                isTradeBex={isTradeBex}
                batchReceivedMin={batchReceivedMin}
              />
            ) : shouldShowDeposit && !shouldShowSpin ? (
              <DepositLotteryButton disableBtnDeposit={disableBtnDeposit} />
            ) : (
              <div className="mt-[6px]">
                <Row gutter={8}>
                  {shouldShowDeposit && (
                    <Col span={12}>
                      <DepositLotteryButton
                        disableBtnDeposit={disableBtnDeposit}
                      />
                    </Col>
                  )}
                  {shouldShowSpin && (
                    <Col span={12}>
                      <SpinLotteryButton />
                    </Col>
                  )}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Form>

      <ModalActivities />
      <ModalSetMaxSlippage type={'buy'} />
    </div>
  );
};
export default PoolPurchaseSummary;
