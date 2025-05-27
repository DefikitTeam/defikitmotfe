/* eslint-disable */
'use client';
import { Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface ISaveCreatePoolButton {
  // form: FormInstance<IPoolCreatForm>;
  isLoading: boolean;
  disiabled?: boolean;
}

const SaveCreatePoolButton = ({
  isLoading,
  disiabled
}: ISaveCreatePoolButton) => {
  const t = useTranslations();
  const { address, chainId } = useAccount();

  const [submittable, setSubmittable] = useState<boolean>(false);

  return (
    <Spin
      spinning={isLoading}
      delay={0}
    >
      <div className="pb-3 pt-3 text-center">
        <Button
          type="default"
          className={`w-[10%] w-fit !flex-1 !font-forza text-white transition-opacity ${disiabled ? 'disabled:opacity-60' : ''} ${!address || !chainId ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            backgroundColor: '#297fd6',
            color: 'white'
            // opacity: disiabled === false ? 1 : 0.6
          }}
          size="large"
          htmlType="submit"
          disabled={disiabled}
        >
          {t('LAUNCH')}
        </Button>
      </div>
    </Spin>
  );
};

export default SaveCreatePoolButton;
