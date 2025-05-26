/* eslint-disable */
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceChart from '@/src/services/external-services/backend-server/chart';
import { IPoolDetail } from '@/src/services/response.type';
import {
  PoolDataDayChart,
  PoolDataHourChart,
  PoolDataMinuteChart
} from '@/src/stores/chart/type';
import { Button, Col, Row, Typography } from 'antd';
import BigNumber from 'bignumber.js';
import { createChart, HistogramData, TickMarkType } from 'lightweight-charts';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

interface Props {
  height?: string | number;
  width?: string | number;
  chainId: number;
  poolInfo: IPoolDetail;
}

export interface IStateValue {
  open: number | string;
  high: number | string;
  close: number | string;
  low: number | string;
  time: number;
}

const { Text, Title } = Typography;
const TradingViewChart = (props: Props) => {
  const { chainId, poolInfo } = props;
  const { isMobile } = useWindowSize();
  const t = useTranslations();
  const [candlePrice, setCandlePrice] = useState<IStateValue | undefined>();
  // const [linePrice, setLinePrice] = useState<any>();
  const [priceColor, setPriceColor] = useState<string>('#089981');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [timeframe, setTimeframe] = useState('minute');
  const { isConnected, address } = useAccount();

  const handleClickTimeframe = (timeframe: string) => {
    if (isConnected && address) {
      setTimeframe(timeframe);
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#222' },
          textColor: '#DDD'
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' }
        },
        timeScale: {
          borderColor: '#71649C',
          rightOffset: 20,
          // barSpacing: 6,
          minBarSpacing: 6,
          timeVisible: true,
          tickMarkFormatter: (time: any, tickMarkType: any, locale: any) => {
            const date = new Date(time * 1000);
            // const myDate = date.toLocaleDateString("en-BD") + " "+ date.getHours() + ":" + date.getMinutes();
            // return myDate;
            switch (tickMarkType) {
              case TickMarkType.Year:
                return date.getFullYear();
              case TickMarkType.Month:
                const monthFormatter = new Intl.DateTimeFormat(locale, {
                  month: 'short'
                });
                return monthFormatter.format(date);
              case TickMarkType.DayOfMonth:
                return date.getDate();
              case TickMarkType.Time:
                const timeFormatter = new Intl.DateTimeFormat(locale, {
                  hour: 'numeric',
                  minute: 'numeric'
                });
                return timeFormatter.format(date);
              case TickMarkType.TimeWithSeconds:
                const timeFormatterWithSeconds = new Intl.DateTimeFormat(
                  locale,
                  {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  }
                );
                return timeFormatterWithSeconds.format(date);
              default:
                return date.toLocaleString(locale);
            }
          }
          // fixLeftEdge: true
        },
        rightPriceScale: {
          borderColor: '#71649C',
          autoScale: true,
          scaleMargins: {
            top: 0.3,
            bottom: 0.25
          },
          visible: true
        },
        localization: {
          locale: 'en-BD',
          timeFormatter: (time: any) => {
            const date = new Date(time * 1000);
            const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
              hour: 'numeric',
              minute: 'numeric',
              month: 'short',
              day: 'numeric',
              year: '2-digit'
            });
            return dateFormatter.format(date);
          }
        }

        // leftPriceScale: {
        //     visible: true
        // },
        // crosshair: {
        //     vertLine: {
        //         // @ts-ignore
        //         width: 5,
        //         style: LineStyle.Solid,
        //         color: '#C3BCDB44',
        //         labelBackgroundColor: '#9B7DFF'
        //     },
        //     horzLine: {
        //         color: '#9B7DFF',
        //         labelBackgroundColor: '#9B7DFF'
        //     }
        // }
      });
      chart.timeScale().fitContent();

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#089981',
        downColor: '#F23645',
        borderVisible: true,
        wickVisible: true,
        wickUpColor: '#089981',
        wickDownColor: '#F23645',
        priceScaleId: 'right'
      });

      const volumeSeries = chart.addHistogramSeries({
        // color: '#26a69a',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: ''
      });

      // const lineSeries = chart.addLineSeries();
      // lineSeries.applyOptions({
      //     lineWidth: 1,
      //     priceScaleId: 'left'
      // });

      const customFormatNumber = (number: number) => {
        if (number === undefined || number === null) {
          return '';
        }

        let [integerPart, decimalPart] = number.toString().split('.');

        if (!decimalPart) {
          return number;
        }

        let zeroCount = 0;
        for (let char of decimalPart) {
          if (char === '0') {
            zeroCount++;
          } else {
            break;
          }
        }

        const subscriptMap: { [key: number]: string } = {
          0: '₀',
          1: '₁',
          2: '₂',
          3: '₃',
          4: '₄',
          5: '₅',
          6: '₆',
          7: '₇',
          8: '₈',
          9: '₉'
        };
        if (zeroCount >= 4) {
          let subscriptZeroCount = zeroCount
            .toString()
            .split('')
            .map((num) => subscriptMap[parseInt(num)])
            .join('');
          decimalPart = `0${subscriptZeroCount}${decimalPart.slice(zeroCount, zeroCount + 4)}`;
        } else if (zeroCount < 4) {
          return number.toFixed(8);
        }

        return `${integerPart}.${decimalPart}`;
      };

      chart.applyOptions({
        localization: {
          priceFormatter: (p: any) => {
            if (typeof p !== 'number') {
              return p;
            }
            return customFormatNumber(p);
          }
        }
      });

      chart.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData) {
          const data = param.seriesData.get(candleSeries) as
            | {
                open: number;
                close: number;
                high: number;
                low: number;
                time: number;
              }
            | undefined;

          if (data) {
            // const linePriceData = param.seriesData.get(lineSeries);
            // setLinePrice(linePriceData as any);
            setCandlePrice({
              open: customFormatNumber(data.open),
              close: customFormatNumber(data.close),
              high: customFormatNumber(data.high),
              low: customFormatNumber(data.low),
              time: data.time
            });
            const currentPriceColor =
              data.close < data.open ? '#F23645' : '#089981';
            setPriceColor(currentPriceColor);
          }
        }
      });

      chart.priceScale('right').applyOptions({
        borderColor: '#71649C',
        visible: true
      });
      // chart.priceScale('left').applyOptions({
      //     borderColor: '#71649C',
      //     visible: true
      // });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.88,
          bottom: 0
        }
      });

      const fetchData = () => {
        const apiFunction = {
          minute: serviceChart.getChartInfoByMinute,
          fiveMinute: serviceChart.getChartInfoBy5Minute,
          hour: serviceChart.getChartInfoByHour,
          day: serviceChart.getChartInfoByDay
        }[timeframe];
        // @ts-ignore
        apiFunction({
          chainId: chainId,
          poolAddress: poolInfo.id
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              let arrayData: any[] = [];
              if (timeframe === 'minute') {
                arrayData = data?.data?.poolMinuteDatas.map(
                  (item: PoolDataMinuteChart) => ({
                    time: Number(item.minuteStartUnix),
                    low: Number(new BigNumber(item.priceLowest)),
                    high: Number(new BigNumber(item.priceHighest)),
                    open: Number(new BigNumber(item.priceOpen)),
                    close: Number(new BigNumber(item.price)),
                    volume: Number(new BigNumber(item.volumeETH))
                  })
                );
              } else if (timeframe === 'fiveMinute') {
                arrayData = data?.data?.pool5MinuteDatas.map(
                  (item: PoolDataMinuteChart) => ({
                    time: Number(item.minuteStartUnix),
                    low: Number(new BigNumber(item.priceLowest)),
                    high: Number(new BigNumber(item.priceHighest)),
                    open: Number(new BigNumber(item.priceOpen)),
                    close: Number(new BigNumber(item.price)),
                    volume: Number(new BigNumber(item.volumeETH))
                  })
                );
              } else if (timeframe === 'hour') {
                arrayData = data?.data?.poolHourDatas.map(
                  (item: PoolDataHourChart) => ({
                    time: Number(item.hourStartUnix),
                    low: Number(new BigNumber(item.priceLowest)),
                    high: Number(new BigNumber(item.priceHighest)),
                    open: Number(new BigNumber(item.priceOpen)),
                    close: Number(new BigNumber(item.price)),
                    volume: Number(new BigNumber(item.volumeETH))
                  })
                );
              } else if (timeframe === 'day') {
                arrayData = data?.data?.poolDayDatas.map(
                  (item: PoolDataDayChart) => ({
                    time: Number(item.dayStartUnix),
                    low: Number(new BigNumber(item.priceLowest)),
                    high: Number(new BigNumber(item.priceHighest)),
                    open: Number(new BigNumber(item.priceOpen)),
                    close: Number(new BigNumber(item.price)),
                    volume: Number(new BigNumber(item.volumeETH))
                  })
                );
              }

              candleSeries?.setData(arrayData);
              volumeSeries.setData(
                arrayData.map(
                  (item) =>
                    ({
                      time: item.time,
                      value: item.volume,
                      color: item.open > item.close ? '#F23645' : '#089981'
                    }) as HistogramData
                )
              );
              // lineSeries.setData(
              //     arrayData.map((item) => ({
              //         time: item.time,
              //         value: (item.close + item.high) / 2
              //     }))
              // );
              setCandlePrice({
                open: customFormatNumber(arrayData[arrayData.length - 1]?.open),
                close: customFormatNumber(
                  arrayData[arrayData.length - 1]?.close
                ),
                high: customFormatNumber(arrayData[arrayData.length - 1]?.high),
                low: customFormatNumber(arrayData[arrayData.length - 1]?.low),
                time: arrayData[arrayData.length - 1]?.time
              });
              const currentPriceColor =
                arrayData[arrayData.length - 1]?.close <
                arrayData[arrayData.length - 1]?.open
                  ? '#F23645'
                  : '#089981';
              setPriceColor(currentPriceColor);
            }
          });
      };
      fetchData();
      const intervalId = setInterval(() => {
        fetchData();
      }, 5000);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth
          });
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        chart.remove();
        clearInterval(intervalId);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [
    chainId,
    poolInfo.id,
    timeframe,
    poolInfo.soldBatch,
    poolInfo.batchAvailable
  ]);

  return (
    <div>
      <div className="relative">
        <div
          ref={chartContainerRef}
          id="tradingview_12345"
        />

        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            zIndex: 10
          }}
        >
          <Row
            gutter={[16, 0]}
            style={{ display: 'flex' }}
          >
            <Col
              xs={8}
              sm={8}
              md={8}
              xxl={6}
              lg={6}
              // flex="1"
              // style={{ display: 'flex' }}
            >
              <div
                className={`w-fit !flex-1 text-nowrap ${isMobile ? 'text-sm' : ''}  ${isMobile ? 'text-sm' : ''}`}
              >
                O
                <span
                  className={` ${isMobile ? 'text-sm' : ''} ${priceColor === '#089981' ? 'text-custom-green' : 'text-custom-red'}`}
                >
                  {candlePrice?.open}
                </span>
              </div>
            </Col>
            <Col
              xs={8}
              sm={8}
              md={8}
              xxl={6}
              lg={6}
              // flex="1"
              // style={{ display: 'flex' }}
            >
              <div
                className={`w-fit !flex-1 text-nowrap ${isMobile ? 'text-sm' : ''}  `}
              >
                H
                <span
                  className={`${isMobile ? 'text-sm' : ''} ${priceColor === '#089981' ? 'text-custom-green' : 'text-custom-red'}`}
                >
                  {candlePrice?.high}
                </span>
              </div>
            </Col>
            {isMobile && (
              <Col
                xs={8}
                sm={8}
                md={8}
                xxl={6}
                lg={6}
                // flex="1"
                // style={{ display: 'flex' }}
              ></Col>
            )}
            <Col
              xs={8}
              sm={8}
              md={8}
              lg={6}
              xxl={6}
              // flex="1"
              // style={{ display: 'flex' }}
            >
              <div
                className={`w-fit !flex-1 text-nowrap ${isMobile ? 'text-sm' : ''}  `}
              >
                L
                <span
                  className={`${isMobile ? 'text-sm' : ''} ${priceColor === '#089981' ? 'text-custom-green' : 'text-custom-red'}`}
                >
                  {candlePrice?.low}
                </span>
              </div>
            </Col>
            <Col
              xs={8}
              sm={8}
              md={8}
              xxl={6}
              lg={6}
              // flex="1"
              // style={{ display: 'flex' }}
            >
              <div
                className={`w-fit !flex-1 text-nowrap ${isMobile ? 'text-sm' : ''}  `}
              >
                C
                <span
                  className={`${isMobile ? 'text-sm' : ''} ${priceColor === '#089981' ? 'text-custom-green' : 'text-custom-red'}`}
                >
                  {candlePrice?.close}
                </span>
              </div>
            </Col>

            {/* <Col
                            xs={6}
                            sm={6}
                            md={12}
                            xxl={6}
                            lg={6}
                        >
                            <div className="w-fit !flex-1 text-nowrap !font-forza ">
                                Value:{' '}
                                <span
                                    className={` ${priceColor === '#089981' ? 'text-custom-green' : 'text-custom-red'}`}
                                >
                                    {linePrice?.value}
                                </span>
                            </div>
                        </Col> */}
          </Row>
        </div>
      </div>

      <div className="mb-0 mt-1 w-full">
        <Row
          gutter={[8, 8]}
          style={{ display: 'flex' }}
        >
          <Col
            flex="1"
            style={{ display: 'flex' }}
          >
            <Button
              size="large"
              style={{ width: '100%' }}
              className={`cursor-pointer border-none text-[#423b3a] hover:bg-[#F0F3FA] hover:font-forza hover:font-bold hover:text-black ${timeframe === 'minute' ? 'bg-[#F0F3FA] font-forza font-bold !text-black' : ''}`}
              // onClick={() => setTimeframe('minute')}
              onClick={() => handleClickTimeframe('minute')}
            >
              1M
            </Button>
          </Col>
          <Col
            flex="1"
            style={{ display: 'flex' }}
          >
            <Button
              size="large"
              style={{ width: '100%' }}
              className={`cursor-pointer border-none text-[#423b3a] hover:bg-[#F0F3FA] hover:font-forza hover:font-bold hover:text-black ${timeframe === 'fiveMinute' ? 'bg-[#F0F3FA] font-forza font-bold !text-black' : ''}`}
              // onClick={() => setTimeframe('fiveMinute')}
              onClick={() => handleClickTimeframe('fiveMinute')}
            >
              5M
            </Button>
          </Col>
          <Col
            flex="1"
            style={{ display: 'flex' }}
          >
            <Button
              size="large"
              style={{ width: '100%' }}
              className={`cursor-pointer border-none text-[#423b3a] hover:bg-[#F0F3FA] hover:font-forza hover:font-bold hover:text-black ${timeframe === 'hour' ? 'bg-[#F0F3FA] font-forza font-bold !text-black' : ''}`}
              // onClick={() => setTimeframe('hour')}
              onClick={() => handleClickTimeframe('hour')}
            >
              1H
            </Button>
          </Col>
          <Col
            flex="1"
            style={{ display: 'flex' }}
          >
            <Button
              size="large"
              style={{ width: '100%' }}
              className={`cursor-pointer border-none text-[#423b3a] hover:bg-[#F0F3FA] hover:font-forza hover:font-bold hover:text-black ${timeframe === 'day' ? 'bg-[#F0F3FA] font-forza font-bold !text-black' : ''}`}
              // onClick={() => setTimeframe('day')}
              onClick={() => handleClickTimeframe('day')}
            >
              1D
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TradingViewChart;
