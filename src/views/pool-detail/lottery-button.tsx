import { Button } from 'antd';

const LotteryButtons = () => {
    return (
        <div className="mt-[6px] flex w-full gap-2">
            <Button
                type="default"
                size="large"
                className="w-1/2 !font-forza transform rounded-full bg-gradient-to-r from-purple-500 to-pink-500 !font-forza text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
            >
                Deposit Lottery
            </Button>
            <Button
                type="default"
                size="large"
                className="w-1/2 !font-forza transform rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 !font-forza text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-orange-600"
            >
                Spin Lottery
            </Button>
        </div>
    );
};

export default LotteryButtons;
