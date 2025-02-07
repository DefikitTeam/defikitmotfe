/* eslint-disable */
import { markCreatePoolSlider } from '@/src/common/constant/constance';
import { formatCurrency } from '@/src/common/utils/utils';
import {
    useCreatePoolLaunchInformation,
    usePassData
} from '@/src/stores/pool/hook';
import { useListTokenOwner } from '@/src/stores/token/hook';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
    Col,
    Collapse,
    CollapseProps,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
    Slider,
    Tooltip,
    Typography
} from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { IPoolCreatForm } from '.';

const { Option } = Select;
interface PoolInforProps {
    form: FormInstance<IPoolCreatForm>;
}

const { Text } = Typography;
const AdvanceConfiguration = ({ form }: PoolInforProps) => {
    const t = useTranslations();
    const {
        passDataState,
        setListDataBonding,
        setListDataFarming,
        setValueForAddLP,
        setValueForAirdrop,
        setValueForBonding,
        setValueForFarming
    } = usePassData();
    const {
        listKeyValueBonding,
        listKeyValueFarming,
        valueForAddLP,
        valueForAirdrop,
        valueForBonding,
        valueForFarming
    } = passDataState;
    const {
        setOpenModdalCreateToken,
        getListTokenByOwner,
        settingTokenState,
        setCurrentChoicedToken
    } = useListTokenOwner();
    const [data, setData, resetData] = useCreatePoolLaunchInformation();

    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    const onChangebBond = (newValue: number) => {
        setData({
            ...data,
            totalBatch: newValue
        });
    };

    const onHandleChangeDropdown = (value: string, field: string) => {
        if (value) {
            const myJSONString = JSON.stringify(value);
            const kien = JSON.parse(myJSONString);

            const tokenCurrentChoiced = settingTokenState.choicedToken;

            if (tokenCurrentChoiced === undefined) return;
            const totalSupply = new BigNumber(
                new BigNumber(tokenCurrentChoiced?.totalSupply)
                    // .div(10 ** Number(tokenCurrentChoiced?.decimals))
                    .toFixed(0)
            );
            const bigNumberValue = new BigNumber(kien.key);
            let tokenForMintingPool = new BigNumber(data.tokenToMint);
            let tokenForFarm = new BigNumber(data.tokenForFarm);
            let tokenForAirdrop = new BigNumber(data.tokenForAirdrop);
            let tokenForLiquidity = new BigNumber(data.tokenForAddLP);

            if (field === 'forMintingPool') {
                tokenForMintingPool = bigNumberValue.integerValue(
                    BigNumber.ROUND_UP
                );
                tokenForLiquidity = totalSupply.minus(
                    tokenForAirdrop.plus(tokenForFarm).plus(tokenForMintingPool)
                );
                setValueForBonding({
                    key: kien.key,
                    value: kien.label
                });
            }
            // if (field === 'forAirdrop') {
            //     tokenForAirdrop = bigNumberValue.integerValue(
            //         BigNumber.ROUND_DOWN
            //     );
            //     tokenForLiquidity = totalSupply.minus(
            //         tokenForMintingPool.plus(tokenForFarm).plus(tokenForAirdrop)
            //     );

            //     setValueForAirdrop({
            //         key: kien.key,
            //         value: kien.label
            //     });
            // }
            if (field === 'forFarming') {
                tokenForFarm = bigNumberValue.integerValue(
                    BigNumber.ROUND_DOWN
                );
                tokenForLiquidity = totalSupply.minus(
                    tokenForMintingPool.plus(tokenForAirdrop).plus(tokenForFarm)
                );

                setValueForFarming({
                    key: kien.key,
                    value: kien.label
                });
            }
            const liquidityPercent = tokenForLiquidity
                .div(totalSupply)
                .times(100);

            setValueForAddLP({
                value: `${liquidityPercent.toFixed(0)}% - ${formatCurrency(tokenForLiquidity.integerValue(BigNumber.ROUND_UP).toString())} ${tokenCurrentChoiced.symbol}`,
                key: tokenForLiquidity.toFixed(0)
            });
            const newData = {
                ...data,
                tokenForAddLP: tokenForLiquidity.toFixed(0),
                tokenToMint: tokenForMintingPool
                    .integerValue(BigNumber.ROUND_UP)
                    .toString(),
                tokenForAirdrop: tokenForAirdrop
                    .integerValue(BigNumber.ROUND_DOWN)
                    .toString(),
                tokenForFarm: tokenForFarm
                    .integerValue(BigNumber.ROUND_DOWN)
                    .toString()
            };
            setData(newData);
        }
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '',
            children: (
                <div className="">
                    {
                        <Row gutter={[4, 8]}>
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <div className="mb-2">
                                    <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                        <Text className="text-lg text-red-500">
                                            *{' '}
                                        </Text>
                                        {t('ADVANCE_CONFIG_MINITNG_POOOL')}
                                        <Tooltip
                                            title={t(
                                                'ADVANCE_CONFIG_MINTING_DESC'
                                            )}
                                        >
                                            <QuestionCircleOutlined
                                                style={{
                                                    marginLeft: '8px'
                                                }}
                                            />
                                        </Tooltip>
                                    </span>

                                    <Select
                                        value={valueForBonding?.value}
                                        // showSearch
                                        style={{ width: '100%' }}
                                        labelInValue
                                        onChange={(newValue: string) => {
                                            onHandleChangeDropdown(
                                                newValue,
                                                'forMintingPool'
                                            );
                                        }}
                                        options={listKeyValueBonding?.map(
                                            (item) => {
                                                return {
                                                    label: item.value,
                                                    value: item.key
                                                };
                                            }
                                        )}
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
                                <div className="mb-2">
                                    <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                        <Text className="text-lg text-red-500">
                                            *{' '}
                                        </Text>
                                        {t('ADVANCE_CONFIG_AIRDROP_POOOL')}
                                        <Tooltip
                                            title={t(
                                                'ADVANCE_CONFIG_AIRDROP_DESC'
                                            )}
                                        >
                                            <QuestionCircleOutlined
                                                style={{
                                                    marginLeft: '8px'
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                    <Input
                                        size="large"
                                        value={valueForAirdrop?.value}
                                        disabled
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
                                <div className="mb-2">
                                    <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                        <Text className="text-lg text-red-500">
                                            *{' '}
                                        </Text>
                                        {t('ADVANCE_CONFIG_FARM_POOOL')}
                                        <Tooltip
                                            title={t(
                                                'ADVANCE_CONFIG_FARM_DESC'
                                            )}
                                        >
                                            <QuestionCircleOutlined
                                                style={{
                                                    marginLeft: '8px'
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                    <Select
                                        //    defaultValue={valueForFarming?.value}
                                        value={valueForFarming?.value}
                                        // showSearch
                                        style={{ width: '100%' }}
                                        labelInValue
                                        onChange={(value: string) =>
                                            onHandleChangeDropdown(
                                                value,
                                                'forFarming'
                                            )
                                        }
                                        options={listKeyValueFarming?.map(
                                            (item) => ({
                                                label: item.value,
                                                value: item.key
                                            })
                                        )}
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
                                <div className="mb-2">
                                    <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                        <Text className="text-lg text-red-500">
                                            *{' '}
                                        </Text>
                                        {t('ADVANCE_CONFIG_LQ_POOOL')}
                                        <Tooltip
                                            title={t('ADVANCE_CONFIG_LQ_DESC')}
                                        >
                                            <QuestionCircleOutlined
                                                style={{
                                                    marginLeft: '8px'
                                                }}
                                            />
                                        </Tooltip>
                                    </span>
                                    <Input
                                        size="large"
                                        value={valueForAddLP?.value}
                                        disabled
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
                                <Form.Item
                                    name="advanceNumberOfBond"
                                    label={
                                        <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                            {t('NUMBER_OF_BOND_CURRENT')}
                                            {': '}{' '}
                                            {`${Number(data.totalBatch)}`}
                                        </span>
                                    }
                                    className="mb-2"
                                    initialValue={Number(data.totalBatch)}
                                >
                                    <Slider
                                        min={1000}
                                        max={10000}
                                        defaultValue={0}
                                        step={1000}
                                        marks={markCreatePoolSlider}
                                        onChange={onChangebBond}
                                        value={Number(data.totalBatch)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    }
                </div>
            )
        }
    ];

    return (
        <>
            <Collapse
                onChange={onChange}
                // defaultActiveKey={['1']}
                items={items}
            />
        </>
    );
};

export default AdvanceConfiguration;
