import { formatCurrency, shortWalletAddress } from '@/src/common/utils/utils';
import useWindowSize from '@/src/hooks/useWindowSize';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { CopyOutlined } from '@ant-design/icons';
import { Tooltip, notification } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

const TokenInformation = () => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();
    const [{ poolStateDetail }] = usePoolDetail();
    const { pool } = poolStateDetail;
    const { isConnected, address } = useAccount();

    const handleCopy = (tokenAddress: string | undefined) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (tokenAddress) {
            navigator.clipboard.writeText(tokenAddress).then(() => {
                notification.success({
                    message: t('ADDRESS_COPIED_TO_CLIPBOARD'),
                    placement: 'top',
                    duration: 1.5,
                    showProgress: true
                });
            });
        }
    };

    return (
        <div className="bg-white pt-2  font-forza text-base">
            <h3 className=" font-bold">Token:</h3>
            <div className="flex flex-col justify-between">
                <div className="flex justify-between">
                    <div className="  ">{t('ADDRESS')}:</div>
                    <div className="  ">
                        <Tooltip
                            title={t('COPY_TO_CLIPBOARD')}
                            className=""
                        >
                            <CopyOutlined
                                className="text-lg"
                                style={{}}
                                onClick={() => handleCopy(pool?.id)}
                            />
                        </Tooltip>
                        {isMobile
                            ? shortWalletAddress(
                                  pool ? pool.id.toLowerCase() : ''
                              )
                            : pool?.id.toLowerCase()}
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="  ">{t('NAME')}:</div>
                    <div className="  ">{pool?.name}</div>
                </div>
                <div className="flex justify-between">
                    <div className="  ">{t('SYMBOL')}:</div>
                    <div className="  ">{pool?.symbol}</div>
                </div>
                <div className="flex justify-between">
                    <div className="  ">{t('DECIMAL')}:</div>
                    <div className="  ">{pool?.decimals}</div>
                </div>
                <div className="flex justify-between">
                    <div className="  ">{t('TOTAL_SUPPLY')}:</div>
                    <div className="  ">
                        {formatCurrency(
                            pool
                                ? new BigNumber(pool.totalSupplyToken)
                                      .div(10 ** parseInt(pool.decimals))
                                      .toFixed(0)
                                : '0'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenInformation;
