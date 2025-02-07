// /* eslint-disable */
// import { TOKEN_STATUS } from '@/src/common/constant/token';
// import Loader from '@/src/components/loader';
// import { useMultiCaller } from '@/src/hooks/useMultiCaller';
// import CurrencyInput from 'react-currency-input-field';

// import {
//     useCreateTokenInformation,
//     useListTokenOwner
// } from '@/src/stores/token/hook';
// import { EActionStatus } from '@/src/stores/type';
// import {
//     Button,
//     Form,
//     Input,
//     Modal,
//     notification,
//     Spin,
//     Typography
// } from 'antd';
// import BigNumber from 'bignumber.js';
// import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useAccount } from 'wagmi';
// const { Text } = Typography;
// const ModalCreateToken = () => {
//     const [status, setStatus] = useState(EActionStatus.Idle);
//     const t = useTranslations();
//     const {
//         setOpenModdalCreateToken,
//         getListTokenByOwner,
//         settingTokenState,
//         setCurrentChoicedToken
//     } = useListTokenOwner();
//     const { address, chainId } = useAccount();
//     const [validateInput, setValidateInput] = useState({
//         totalSupply: {
//             error: false,
//             helperText: ''
//         }
//     });
//     const [data, setCreateTokenInformation, resetData] =
//         useCreateTokenInformation();
//     const [isLoadingCreateToken, setIsLoadingCreateToken] =
//         useState<boolean>(false);
//     const { useCreateRocketToken } = useMultiCaller();
//     const router = useRouter();
//     const handleClose = () => {
//         resetData();
//         setOpenModdalCreateToken(false);
//     };

//     const onChange = (
//         event:
//             | React.ChangeEvent<HTMLInputElement>
//             | React.ChangeEvent<HTMLTextAreaElement>
//     ) => {
//         const { name, value } = event.target;

//         setCreateTokenInformation({
//             ...data,
//             [name]: value.trim()
//         });
//     };

//     const handleValueChange = (value: any, name: any) => {
//         let validateTotalSupply = false;
//         let validateTotalSupplyHelperText = '';

//         if (value !== undefined && parseInt(value) > 0) {
//             validateTotalSupply = false;
//             validateTotalSupplyHelperText = '';

//             setCreateTokenInformation({
//                 ...data,
//                 [name]: value.trim()
//             });
//         } else if (value === undefined || parseInt(value) <= 0) {
//             validateTotalSupply = true;
//             validateTotalSupplyHelperText = t(
//                 'PLEASE_INPUT_YOUR_TOKEN_TOTAL_SUPPLY'
//             );
//         }
//         setValidateInput({
//             ...validateInput,
//             totalSupply: {
//                 error: validateTotalSupply,
//                 helperText: validateTotalSupplyHelperText
//             }
//         });
//     };

//     const onFinish = async () => {
//         setIsLoadingCreateToken(true);
//         try {
//             const totalSupply = new BigNumber(data.totalSupply)
//                 .times(10 ** Number(data.decimal))
//                 .toFixed(0);
//             await useCreateRocketToken.actionAsync({
//                 name: data.name,
//                 symbol: data.symbol,
//                 decimal: data.decimal,
//                 totalSupply: totalSupply
//             });
//             // resetData();
//             // setOpenModdalCreateToken(false)
//         } catch (error) {
//             notification.error({
//                 message: 'Error',
//                 description: 'Something went wrong!'
//             });
//             setStatus(EActionStatus.Failed);
//             setIsLoadingCreateToken(false);
//         } finally {
//             setIsLoadingCreateToken(false);
//         }
//     };

//     useEffect(() => {
//         if (useCreateRocketToken.isLoadingInitCreateToken) {
//             setIsLoadingCreateToken(true);
//             notification.info({
//                 message: 'Token in Progress',
//                 description: 'Please wait while your token is being processed.',
//                 duration: 1.3,
//                 showProgress: true
//             });
//         }
//     }, [useCreateRocketToken.isLoadingInitCreateToken]);

//     useEffect(() => {
//         if (useCreateRocketToken.isLoadingAgreedCreateToken) {
//             setIsLoadingCreateToken(true);
//             notification.info({
//                 message: 'Create token are being processed',
//                 description: 'Please wait while your token is being processed.',
//                 duration: 2,
//                 showProgress: true
//             });
//         }
//     }, [useCreateRocketToken.isLoadingAgreedCreateToken]);

//     useEffect(() => {
//         if (useCreateRocketToken.isConfirmed) {
//             setIsLoadingCreateToken(false);
//             resetData();
//             setOpenModdalCreateToken(false);
//             notification.success({
//                 message: 'Create token successfully!',

//                 duration: 1.2,
//                 showProgress: true
//             });
//             setTimeout(() => {
//                 getListTokenByOwner({
//                     ownerAddress: address as `0x${string}`,
//                     chainId: chainId as number,
//                     status: TOKEN_STATUS.INACTIVE
//                 });
//             }, 10000);
//         }
//     }, [useCreateRocketToken.isConfirmed]);

//     useEffect(() => {
//         if (useCreateRocketToken.isError) {
//             setIsLoadingCreateToken(false);

//             notification.error({
//                 message: 'Transaction Failed',
//                 duration: 3,
//                 showProgress: true
//             });
//         }
//     }, [useCreateRocketToken.isError]);
//     const handleKeyPress = (event: any) => {
//         const pattern = /^[0-9.]*$/;
//         if (!pattern.test(event.key)) {
//             event.preventDefault();
//         }
//     };

//     if (
//         settingTokenState.status === EActionStatus.Pending ||
//         !settingTokenState.tokenList
//     ) {
//         return <Loader />;
//     }

//     return (
//         <Modal
//             title={
//                 <span className="!font-forza text-lg font-bold">
//                     {t('CREATE_NEW_TOKEN')}
//                 </span>
//             }
//             open={settingTokenState.openModalCreateToken}
//             footer={null}
//             onCancel={handleClose}
//             maskClosable={true}
//             centered
//         >
//             <div className="mb-6">
//                 <Form
//                     layout="vertical"
//                     onFinish={onFinish}
//                 >
//                     <Form.Item
//                         name="name"
//                         label={
//                             <span className="!font-forza text-base ">
//                                 {t('NAME')}
//                             </span>
//                         }
//                         required
//                         rules={[
//                             {
//                                 required: true,
//                                 message: t('PLEASE_INPUT_YOUR_TOKEN_NAME')
//                             }
//                         ]}
//                         className="mb-1 !font-forza text-base"
//                         initialValue={data.name}
//                     >
//                         <Input
//                             name="name"
//                             size="large"
//                             value={data.name}
//                             placeholder={t('TOKEN_NAME')}
//                             onChange={onChange}
//                             className="!font-forza text-base"
//                         />
//                     </Form.Item>

//                     <Form.Item
//                         name="symbol"
//                         label={
//                             <span className="!font-forza text-base ">
//                                 {t('SYMBOL')}
//                             </span>
//                         }
//                         required
//                         rules={[
//                             {
//                                 required: true,
//                                 message: t('PLEASE_INPUT_YOUR_TOKEN_SYMBOL')
//                             }
//                         ]}
//                         className="mb-1"
//                         initialValue={data.symbol}
//                     >
//                         <Input
//                             name="symbol"
//                             value={data.symbol}
//                             size="large"
//                             onChange={onChange}
//                             placeholder={t('SYMBOL')}
//                             className="!font-forza text-base"
//                         />
//                     </Form.Item>

//                     <div className="mb-1 flex flex-col gap-1">
//                         <span className="!font-forza text-base">
//                             <Text className="text-lg text-red-500">* </Text>
//                             {t('TOTAL_SUPPLY')}
//                         </span>

//                         <CurrencyInput
//                             name="totalSupply"
//                             placeholder={t('TOTAL_SUPPLY')}
//                             defaultValue={data.totalSupply}
//                             decimalsLimit={2}
//                             // value={data.totalSupply}
//                             onValueChange={(value, name) =>
//                                 handleValueChange(value, name)
//                             }
//                             groupSeparator=","
//                             decimalSeparator="."
//                             className="!font-forza text-base focus:border-[#1677FF] focus:outline-none"
//                             style={{
//                                 width: '100%',
//                                 padding: '5px 12px',
//                                 height: '40px',
//                                 border: 'solid 1px #ccc',
//                                 borderRadius: '5px'
//                             }}
//                         />
//                         {validateInput.totalSupply.error === true && (
//                             <Text className="text-red-500">
//                                 {validateInput.totalSupply.helperText}
//                             </Text>
//                         )}
//                     </div>

//                     <Form.Item
//                         wrapperCol={{ span: 24 }}
//                         className="mt-10 flex justify-center "
//                     >
//                         <Spin
//                             spinning={
//                                 status === EActionStatus.Pending ||
//                                 isLoadingCreateToken
//                             }
//                             delay={0}
//                         >
//                             <Button
//                                 htmlType="submit"
//                                 type="default"
//                                 className="rounded bg-primary text-center !font-forza text-sm text-white shadow-sm transition-opacity  duration-200 disabled:opacity-60"
//                                 size="large"
//                                 disabled={
//                                     status === EActionStatus.Pending ||
//                                     !address ||
//                                     !chainId ||
//                                     validateInput.totalSupply.error === true
//                                 }
//                             >
//                                 {t('CREATE')}
//                             </Button>
//                         </Spin>{' '}
//                         {/* </div> */}
//                     </Form.Item>
//                 </Form>
//             </div>
//         </Modal>
//     );
// };

// export default ModalCreateToken;
