/* eslint-disable */
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import {
    ChainId,
    KeyValueObj,
    markSlider,
    TOKEN_STATUS
} from '@/src/common/constant/constance';

import { divToDecimal } from '@/src/common/utils/utils';
import { useReader } from '@/src/hooks/useReader';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { IPool } from '@/src/services/response.type';
import { RootState } from '@/src/stores';
import {
    usePortfolio,
    useSellTokenInformation
} from '@/src/stores/profile/hook';
import { EActionStatus } from '@/src/stores/type';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
    Col,
    Form,
    Input,
    Row,
    Select,
    Slider,
    Tooltip,
    Typography
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import SaveButtonSell from './save-button-sell';
import { useConfig } from '@/src/hooks/useConfig';
export interface ISellForm {}
const { Text } = Typography;
const SellToken = () => {
    const t = useTranslations();
    const { chainConfig } = useConfig();

    const [data, setData] = useSellTokenInformation();
    const [{ portfolio }, fetchPortfolio, setIdCurrentChoosedTokenSell] =
        usePortfolio();

    const {
        createdPools,
        createdTokens,
        investedPools,
        priceNative,
        totalInvestedETH,
        idChooseTokenSell
    } = portfolio;
    const searchParams = useSearchParams();
    const addressParams = searchParams?.get('address');

    const [maxRepeatPurchase, setMaxRepeatPurchase] = useState('0');
    const [disableBtnSell, setDisableBtnSell] = useState(true);
    const [selectedToken, setSelectedToken] = useState<IPool>();
    const [maxAmountETH, setMaxAmountETH] = useState(0);
    const [sliderPercent, setSliderPercent] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sellAmountBtn, setSellAmountBtn] = useState('');
    const [form] = useForm<ISellForm>();

    const [bondAmountValue, setBondAmountValue] = useState('0');

    const [status, setStatus] = useState<EActionStatus>(EActionStatus.Idle);
    const [tokenAddressList, setListTokenAddress] = useState<KeyValueObj[]>([]);
    const [defaultTokenAddress, setDefaultTokenAddress] =
        useState<KeyValueObj>();
    const [balanceOfUser, setBalanceOfUser] = useState('0');
    const { address, chainId } = useAccount();
    const chainData = useSelector((state: RootState) => state.chainData);
    const multiCallerContract = getContract(
        chainConfig?.chainId! || ChainId.BARTIO
    );

    const clearForm = () => {
        setDisableBtnSell(true);
        setSliderPercent(0);
        setSellAmountBtn('');
        setBondAmountValue('0');
        setMaxAmountETH(0);
    };
    const [validateInput, setValidateInput] = useState({
        bondAmount: {
            error: false,
            helperText: ''
        }
    });

    useEffect(() => {
        // if(addressParams  && addressParams !== address) {
        //     return;
        // }
        if ((address as `0x${string}`) && portfolio.investedPools.length > 0) {
            let activeInvestPools = portfolio.investedPools.filter(
                (item: IPool) => {
                    return (
                        item.status !== TOKEN_STATUS.FAIL &&
                        item.status !== TOKEN_STATUS.COMPLETED
                    );
                }
            );
            let tokenAddressList = activeInvestPools.map((item: IPool) => ({
                key: `${item.id}`,
                value: `${item.name} - ${item.id}`
            }));

            setListTokenAddress(tokenAddressList);
        }
    }, [portfolio.investedPools]);

    const handleChangeChoiceToken = (value: string) => {
        setIdCurrentChoosedTokenSell(value);
    };
    useEffect(() => {
        if ((address as `0x${string}`) && portfolio.idChooseTokenSell) {
            const token = portfolio.investedPools
                .filter((item: IPool) => {
                    return (
                        item.status !== TOKEN_STATUS.FAIL &&
                        item.status !== TOKEN_STATUS.COMPLETED
                    );
                })
                .find(
                    (item) =>
                        item.id.toLowerCase() ===
                        portfolio.idChooseTokenSell?.toLowerCase()
                );
            if (token) {
                setSelectedToken(token);
                setDefaultTokenAddress({
                    key: `${token.id}`,
                    value: `${token.name} - ${token.id}`
                });
                const tokenForSale = new BigNumber(token.tokenForSale);
                const totalBatch = new BigNumber(token.totalBatch);
                getUserPoolInfo(token.id);
                setData({
                    ...data,
                    poolAddress: token.id
                });
                setMaxRepeatPurchase(
                    tokenForSale
                        .div(totalBatch)
                        .div(10 ** parseInt(token.decimals))
                        .toFixed(0)
                );
            }
        }
    }, [portfolio.idChooseTokenSell, tokenAddressList]);

    useEffect(() => {
        if (!(address as `0x${string}`) || !chainId) {
            setIdCurrentChoosedTokenSell('');
            handleClearChoosedToken();

            setListTokenAddress([] as KeyValueObj[]);
            return;
        }
    }, [address]);

    const handleClearChoosedToken = () => {
        setMaxRepeatPurchase('0');
        setSelectedToken(undefined);
        setBalanceOfUser('0');
        setDefaultTokenAddress(undefined);
        clearForm();
    };
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

    const { dataReader, isFetchingDataReader, reFetchDataReader } = useReader({
        contractAddAndAbi: multiCallerContract,
        poolAddress: selectedToken?.id as string,
        value: Number(bondAmountValue),
        chainId: chainId as number
    });

    const estimateSellValue = dataReader ? dataReader[3] : undefined;
    const estimateSellValueData = estimateSellValue?.result;

    const handleChangeSlider = (newValue: number | number[]) => {
        const sellVolume = newValue as number;
        const now = new Date();
        if (selectedToken) {
            if (sellVolume) {
                if (parseInt(selectedToken.startTime) * 1000 <= now.valueOf()) {
                    setDisableBtnSell(false);
                }
                let validateInputError = false;
                let validateInputHelperText = '';
                // setBondAmountValue(sellVolume.toString());
                if (sellVolume > parseInt(balanceOfUser)) {
                    validateInputError = true;
                    validateInputHelperText = t(
                        'SELL_BOND_AMOUNT_TOKEN_MUST_BE_LESS_THAN_BALANCEOF'
                    );
                    setDisableBtnSell(true);
                } else {
                    validateInputError = false;
                    validateInputHelperText = '';
                    setBondAmountValue(sellVolume.toString());
                    setSliderPercent(sellVolume);
                    setData({
                        ...data,
                        numberBatch: sellVolume
                    });
                }
                setValidateInput({
                    ...validateInput,
                    bondAmount: {
                        error: validateInputError,
                        helperText: validateInputHelperText
                    }
                });
            } else {
                clearForm();
                setData({
                    ...data,
                    numberBatch: 0
                });
            }
        } else {
            setSliderPercent(sellVolume);
            setBondAmountValue(sellVolume.toString());
        }

        setData({
            ...data,
            numberBatch: sellVolume
        });
    };

    const handleKeyPress = (event: any) => {
        const pattern = /^[0-9]*$/;
        if (!pattern.test(event.key)) {
            event.preventDefault();
        }
    };
    const handleOnChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        if (isNaN(Number(value)) || Number(value) === 0) {
            setSliderPercent(0);
            setSellAmountBtn('');
            clearForm();
            setBondAmountValue('');
            return;
        }

        let validateBondAmount = false;
        let validateBonAmountHelperText = '';

        if (selectedToken) {
            if (parseInt(value) > parseInt(balanceOfUser)) {
                validateBondAmount = true;
                validateBonAmountHelperText = t(
                    'SELL_BOND_AMOUNT_TOKEN_MUST_BE_LESS_THAN_BALANCEOF'
                );
            } else {
                validateBondAmount = false;
                validateBonAmountHelperText = '';

                setData({
                    ...data,
                    [name]: Number(value)
                });
                setBondAmountValue(value.toString());
                const now = new Date();
                if (value) {
                    if (
                        selectedToken &&
                        parseInt(selectedToken.startTime) * 1000 <=
                            now.valueOf()
                    ) {
                        setDisableBtnSell(false);
                    } else {
                        setDisableBtnSell(true);
                    }
                    setSliderPercent(Number(value));
                } else {
                    setSliderPercent(0);
                    setDisableBtnSell(true);
                    setSellAmountBtn('');
                    setBondAmountValue('0');
                    setMaxAmountETH(0);
                }
            }
        }
        setValidateInput({
            ...validateInput,
            bondAmount: {
                error: validateBondAmount,
                helperText: validateBonAmountHelperText
            }
        });
    };

    useEffect(() => {
        const value: number = sliderPercent;
        setIsLoading(true);
        try {
            if (value) {
                if (isFetchingDataReader === false && estimateSellValueData) {
                    const estimateSellRes = divToDecimal(estimateSellValueData);

                    setMaxAmountETH(estimateSellRes);

                    setData({
                        ...data,
                        maxAmountETH: Number(estimateSellRes)
                    });
                    setSellAmountBtn(
                        `${parseFloat(maxRepeatPurchase) * value} ${selectedToken?.symbol} ~ ${new BigNumber(estimateSellRes).toFixed(6)} ${chainConfig?.currency}`
                    );
                }
            }
        } catch (error) {
            console.log('==== call estimate error: ', error);
        }
        setIsLoading(false);
    }, [isFetchingDataReader, estimateSellValueData, sliderPercent]);

    return (
        <div className="h-full w-full ">
            <Form layout="vertical">
                <Row gutter={[0, 10]}>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <div className="mb-0 text-lg">
                            <span className="!font-forza text-lg">
                                {t('TOKEN_ADDRESS')}
                            </span>
                            <Select
                                placeholder={
                                    <span className="!font-forza text-lg">
                                        {t('SELECT_TOKEN_ADDRESS')}
                                    </span>
                                }
                                value={defaultTokenAddress?.value}
                                // showSearch
                                allowClear
                                onClear={handleClearChoosedToken}
                                optionFilterProp="label"
                                size="large"
                                style={{ width: '100%' }}
                                onChange={(value) =>
                                    handleChangeChoiceToken(value)
                                }
                                options={tokenAddressList.map((item) => ({
                                    value: item.key,
                                    label: (
                                        <span className="!font-forza text-base">
                                            {item.value}
                                        </span>
                                    )
                                }))}
                            />
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
                            <div className="font-forza text-lg ">
                                {t('AMOUNT_PER_BOND')}
                            </div>

                            <Input
                                size="large"
                                disabled={true}
                                value={maxRepeatPurchase}
                                className="!font-forza text-lg"
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
                    >
                        <div className=" mb-0">
                            <span className="!font-forza text-lg">
                                <Text className="text-lg text-red-500 ">
                                    *{' '}
                                </Text>

                                {t('BOND_AMOUNT')}

                                <Tooltip title={t('MAXIMUM_BOND_AMOUNT')}>
                                    <QuestionCircleOutlined
                                        style={{ marginLeft: '8px' }}
                                    />
                                </Tooltip>
                            </span>

                            <Input
                                type="number"
                                size="large"
                                variant={'outlined'}
                                placeholder={t('ENTER_NUMBER_BOND')}
                                name="numberBatch"
                                value={bondAmountValue}
                                min={0}
                                max={
                                    parseInt(balanceOfUser) > 0
                                        ? parseInt(balanceOfUser)
                                        : 999999999999999999
                                }
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

                            <div className="mt-1 text-right !font-forza text-lg text-blue-400">
                                {t('YOUR_BALANCE')}: {balanceOfUser}{' '}
                                {t('BONDS')}
                            </div>
                        </div>
                    </Col>

                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <Slider
                            autoFocus={true}
                            min={0}
                            max={
                                parseInt(balanceOfUser) > 100
                                    ? 100
                                    : parseInt(balanceOfUser)
                            }
                            marks={
                                parseInt(balanceOfUser) >= 100 ? markSlider : {}
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
                    >
                        <div className="mb-0">
                            <span className="!font-forza text-base">
                                {t('MAX_AMOUNT')} {`${chainConfig?.currency}`}
                            </span>
                            <Input
                                size="large"
                                disabled={true}
                                value={maxAmountETH}
                                className="!font-forza text-base"
                                style={{
                                    backgroundColor: '#CCCCCC',
                                    color: '#7E7E97'
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <SaveButtonSell
                    text={sellAmountBtn}
                    isLoading={status === EActionStatus.Pending}
                    clearForm={clearForm}
                    disableBtnSell={disableBtnSell}
                />
            </Form>
        </div>
    );
};
export default SellToken;
