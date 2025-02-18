// /* eslint-disable */
// import { KeyValueObj } from '@/src/common/constant/constance';
// import { TOKEN_STATUS } from '@/src/common/constant/token';
// import { formatCurrency } from '@/src/common/utils/utils';
// import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
// import useWindowSize from '@/src/hooks/useWindowSize';
// import {
//     useCreatePoolLaunchInformation,
//     usePassData
// } from '@/src/stores/pool/hook';
// import { useListTokenOwner } from '@/src/stores/token/hook';
// import { ITokenList } from '@/src/stores/token/type';
// import { Button, Select, Typography } from 'antd';
// import BigNumber from 'bignumber.js';
// import { useTranslations } from 'next-intl';
// import { useEffect, useState } from 'react';
// import { useAccount } from 'wagmi';
// import ModalCreateToken from './modal-create-token';
// const { Title } = Typography;

// const CreateToken = () => {
//     const t = useTranslations();
//     const { isMobile } = useWindowSize();
//     const [listKeyValueToken, setListKeyValueToken] = useState<KeyValueObj[]>(
//         []
//     );
//     const [data, setData, resetData] = useCreatePoolLaunchInformation();
//     const { address, chainId } = useAccount();

//     const {
//         setListDataBonding,
//         setListDataFarming,
//         setValueForAddLP,
//         setValueForAirdrop,
//         setValueForBonding,
//         setValueForFarming,
//         resetPassData
//     } = usePassData();

//     const {
//         setOpenModdalCreateToken,
//         getListTokenByOwner,
//         settingTokenState,
//         setCurrentChoicedToken
//     } = useListTokenOwner();
//     useEffect(() => {
//         if (!(address as `0x${string}`) || !chainId) {
//             resetData();
//             setListKeyValueToken([] as KeyValueObj[]);
//             resetPassData();
//             setCurrentChoicedToken({
//                 id: '',
//                 owner: '',
//                 name: '',
//                 symbol: '',
//                 decimals: '',
//                 totalSupply: '',
//                 status: ''
//             });
//             return;
//         }
//         getListTokenByOwner({
//             ownerAddress: address as `0x${string}`,
//             chainId: chainData.chainId as number,
//             status: TOKEN_STATUS.INACTIVE
//         });
//     }, [settingTokenState.filter, address, chainData.chainId]);

//     useEffect(() => {
//         if (
//             settingTokenState.tokenList.length > 0 &&
//             (address as `0x${string}`)
//         ) {
//             const listToken = settingTokenState.tokenList.map(
//                 (token: ITokenList) => ({
//                     key: token.id,
//                     value: `${token.name} - ${token.id}`
//                 })
//             );
//             setListKeyValueToken(listToken);
//         }
//     }, [settingTokenState.tokenList]);

//     const [loadingCreateToken, setLoadingCreateToken] = useState(false);

//     const hanleOpenCreateTokenModal = () => {
//         setOpenModdalCreateToken(true);
//     };

//     const handleChangeChoiceToken = (value: string) => {
//         const tokenCurrentChoiced = settingTokenState.tokenList.find(
//             (item) => item.id === value?.toLowerCase()
//         );
//         setCurrentChoicedToken(tokenCurrentChoiced as ITokenList);
//         let totalSupply = '0';
//         if (tokenCurrentChoiced !== undefined) {
//             totalSupply = new BigNumber(tokenCurrentChoiced.totalSupply)
//                 .div(10 ** Number(tokenCurrentChoiced.decimals))
//                 .toFixed(0);
//             const totalSupplyBigNumber = new BigNumber(totalSupply);
//             const listBonding: KeyValueObj[] = [
//                 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80
//             ].map((item: number) => {
//                 return {
//                     value: `${item} % - ${formatCurrency(totalSupplyBigNumber.times(item).div(100).integerValue(BigNumber.ROUND_UP).toString())} ${tokenCurrentChoiced.symbol}`,
//                     key: totalSupplyBigNumber
//                         .times(item)
//                         .div(100)
//                         .integerValue(BigNumber.ROUND_UP)
//                         .toString()
//                 };
//             });

//             setListDataBonding(listBonding);
//             setValueForBonding(listBonding[0]);

//             const listAirdrop: KeyValueObj = {
//                 value: `5 % - ${formatCurrency(totalSupplyBigNumber.times(5).div(100).integerValue(BigNumber.ROUND_DOWN).toString())} ${tokenCurrentChoiced.symbol}`,
//                 key: totalSupplyBigNumber
//                     .times(5)
//                     .div(100)
//                     .integerValue(BigNumber.ROUND_DOWN)
//                     .toString()
//             };

//             setValueForAirdrop(listAirdrop);

//             const listFarming: KeyValueObj[] = [0, 1, 2, 3, 4, 5].map(
//                 (item: number) => {
//                     return {
//                         value: `${item} % - ${formatCurrency(totalSupplyBigNumber.times(item).div(100).integerValue(BigNumber.ROUND_DOWN).toString())} ${tokenCurrentChoiced.symbol}`,
//                         key: totalSupplyBigNumber
//                             .times(item)
//                             .div(100)
//                             .integerValue(BigNumber.ROUND_DOWN)
//                             .toString()
//                     };
//                 }
//             );
//             setListDataFarming(listFarming);
//             setValueForFarming(listFarming[listFarming.length - 1]);
//         }
//         if (value) {
//             const totalSupplyBn = new BigNumber(totalSupply);
//             const tokenForSale = totalSupplyBn
//                 .times(0.7)
//                 .integerValue(BigNumber.ROUND_UP)
//                 .toFixed(0);
//             const tokenForFarm = totalSupplyBn
//                 .times(0.05)
//                 .integerValue(BigNumber.ROUND_DOWN)
//                 .toFixed(0);
//             const tokenForAirdrop = totalSupplyBn
//                 .times(0.05)
//                 .integerValue(BigNumber.ROUND_DOWN)
//                 .toFixed(0);
//             const tokenForAddLP = totalSupplyBn
//                 .minus(tokenForFarm)
//                 .minus(tokenForSale)
//                 .minus(tokenForAirdrop)
//                 .toFixed(0);

//             setData({
//                 ...data,
//                 token: value,
//                 tokenForAirdrop: tokenForAirdrop,
//                 tokenForFarm: tokenForFarm,
//                 tokenToMint: tokenForSale,
//                 tokenForAddLP: tokenForAddLP
//             });
//             setValueForAddLP({
//                 value: `20% - ${formatCurrency(tokenForAddLP)} ${tokenCurrentChoiced && tokenCurrentChoiced.symbol}`,
//                 key: data.tokenForAddLP
//             });
//         }
//     };

//     const handleClearChoosedToken = () => {
//         setCurrentChoicedToken({
//             id: '',
//             owner: '',
//             name: '',
//             symbol: '',
//             decimals: '',
//             totalSupply: '',
//             status: ''
//         });
//         resetPassData();
//     };

//     return (
//         <>
//             <div className="!font-forza text-lg">{t('TOKEN_ADDRESS')}</div>
//             <div className="flex w-[100%] items-center justify-between space-x-2 pb-3">
//                 <div className="h-[56px] flex-1  overflow-hidden ">
//                     <Select
//                         className="h-full w-full overflow-hidden"
//                         placeholder={
//                             <span className="!font-forza text-base">
//                                 {t('SELECT_TOKEN_ADDRESS')}
//                             </span>
//                         }
//                         value={settingTokenState.choicedToken?.id}
//                         // showSearch
//                         allowClear
//                         onClear={handleClearChoosedToken}
//                         optionFilterProp="label"
//                         size="large"
//                         style={{ width: '100%' }}
//                         onChange={(value) => handleChangeChoiceToken(value)}
//                         options={listKeyValueToken.map((item) => ({
//                             value: item.key,
//                             label: (
//                                 <span className="!font-forza">
//                                     {item.value}
//                                 </span>
//                             )
//                         }))}
//                     />
//                 </div>
//                 <Title
//                     level={4}
//                     className="text-nowrap font-medium !leading-[50px] "
//                 >
//                     {t('OR')}
//                 </Title>
//                 <Button
//                     size="large"
//                     className={` h-[56px]
//                         ${!isMobile ? 'w-fit text-nowrap px-2' : 'min-w-[64px] max-w-[80px] whitespace-normal px-2 '}

//                     !font-forza transition-opacity disabled:opacity-60 ${!(address as `0x${string}`) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
//                     style={{
//                         backgroundColor: '#297fd6',
//                         color: 'white'
//                         // opacity: !(chainId && address) ? 0.6 : 1
//                         // width: '64px'
//                     }}
//                     onClick={hanleOpenCreateTokenModal}
//                     loading={loadingCreateToken}
//                     disabled={!(address as `0x${string}`)}
//                 >
//                     {t('CREATE_NEW_TOKEN')}
//                 </Button>
//             </div>
//             <ModalCreateToken />
//         </>
//     );
// };

// export default CreateToken;
