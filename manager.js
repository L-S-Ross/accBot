const fs = require('fs');
const SMA = require('technicalindicators').SMA;
const SMA2 = require('technicalindicators').SMA;
const ADX = require('technicalindicators').ADX;
const ATR = require('technicalindicators').ATR;

const fifteenSMA = require('technicalindicators').SMA;
const fifteenSMA2 = require('technicalindicators').SMA;
const fifteenADX = require('technicalindicators').ADX;
const fifteenATR = require('technicalindicators').ATR;

const hourSMA = require('technicalindicators').SMA;
const hourSMA2 = require('technicalindicators').SMA;
const hourADX = require('technicalindicators').ADX;
const hourATR = require('technicalindicators').ATR;

const threeHourSMA = require('technicalindicators').SMA;
const threeHourSMA2 = require('technicalindicators').SMA;
const threeHourADX = require('technicalindicators').ADX;
const threeHourATR = require('technicalindicators').ATR;

const daySMA = require('technicalindicators').SMA;
const daySMA2 = require('technicalindicators').SMA;
const dayADX = require('technicalindicators').ADX;
const dayATR = require('technicalindicators').ATR;

const pairsArray = ['IOTBTC', 'IOTETH', 'ETHBTC', 'NEOBTC', 'NEOETH', 'BTCUSD', 'ETHUSD','IOTUSD', 'NEOUSD'];//, 'ETHBTC', 'NEOBTC', 'BTCUSD'
const BFXTrade = require('./BfxTrade');

var bfx = new BFXTrade(pairsArray);

var pairs = {};
const tmaPeriods = 13;
const tma2Periods = 35;
const tadxPeriods = 15;
const tatrPeriods = 14;

const maPeriods = 35;
const ma2Periods = 100;
const adxPeriods = 35;
const atrPeriods = 35;

const trendStrength = 20;

var openedPositions = 0;
var success = 0;
var loss = 0;

function Manager(){

	
}

function round(number, precision){
		var shift = function(number, precision){
			var numArray = (''+ number).split('e');
			return +(numArray[0] + 'e' + (numArray[1]?(+numArray+precision):precision));
		};
		return shift(Math.round(shift(number, +precision)), -precision);
	}

function initPairs(){

	for(pair of pairsArray){
		
			pairs[pair]={
				ma: new SMA({period : tmaPeriods, values : []}),
				maValue:0,
				ma2: new SMA2({period : tma2Periods, values : []}),
				ma2Value:0,
				adx: new ADX({period : tadxPeriods, close:[], high:[], low:[]}),
				adxValue: 0,
				atr: new ATR({period : tatrPeriods, close:[], high:[], low:[]}),
				atrValue: 0 ,
				prevMaValue:0,
				sellALT: false,
				sellBTC: false,
				success: 0,
				loss: 0,
				profit: 0,
				profitPct:0,
				open: - Infinity,
				high: - Infinity,
				low: Infinity,
				close: - Infinity,
				sellPrice: - Infinity,
				sellAmount: 0,
				lastPrice: - Infinity,
				dayHighPrice: - Infinity,
				dayLowPrice: Infinity,
				askPrice: - Infinity,
				bidPrice: Infinity,
				volume: - Infinity,
				dayChange: - Infinity,
				dayChangePct: - Infinity,
				ALTSellLevel: Infinity,
				BTCSellLevel: - Infinity,
				prevOpen: - Infinity,
				prevHigh: - Infinity,
				prevLow: Infinity,
				prevClose: - Infinity,
				thirdOpen: - Infinity,
				thirdHigh: - Infinity,
				thirdLow: Infinity,
				thirdClose: - Infinity,
				prevSellPrice: - Infinity,
				prevSellAmount: 0,
				prevLastPrice: - Infinity,
				prevDayHighPrice: - Infinity,
				prevDayLowPrice: Infinity,
				prevAskPrice: - Infinity,
				prevBidPrice: Infinity,
				prevVolume: - Infinity,
				prevDayChange: - Infinity,
				prevDayChangePct: - Infinity,
				prevALTSellLevel: Infinity,
				prevBTCSellLevel: - Infinity,
				latestPerc: 0,
				candlePerc: 0,
				prevCandlePerc: 0,
				thirdCandlePerc: 0,
				fifteenOpen: - Infinity,
				fifteenHigh: - Infinity,
				fifteenLow: Infinity,
				fifteenClose: - Infinity,
				fifteenPrevOpen: - Infinity,
				fifteenPrevHigh: - Infinity,
				fifteenPrevLow: Infinity,
				fifteenPrevClose: - Infinity,
				fifteenThirdOpen: - Infinity,
				fifteenThirdHigh: - Infinity,
				fifteenThirdLow: Infinity,
				fifteenThirdClose: - Infinity,
				fifteenMa: new SMA({period : maPeriods, values : []}),
				fifteenMaValue:0,
				fifteenMa2: new SMA2({period : ma2Periods, values : []}),
				fifteenMa2Value:0,
				fifteenAdx: new ADX({period : adxPeriods, close:[], high:[], low:[]}),
				fifteenAdxValue: 0,
				fifteenAtr: new ATR({period : atrPeriods, close:[], high:[], low:[]}),
				fifteenAtrValue: 0 ,
				fifteenPrevMaValue:0,
				hourOpen: - Infinity,
				hourHigh: - Infinity,
				hourLow: Infinity,
				hourClose: - Infinity,
				hourPrevOpen: - Infinity,
				hourPrevHigh: - Infinity,
				hourPrevLow: Infinity,
				hourPrevClose: - Infinity,
				hourThirdOpen: - Infinity,
				hourThirdHigh: - Infinity,
				hourThirdLow: Infinity,
				hourThirdClose: - Infinity,
				hourMa: new SMA({period : maPeriods, values : []}),
				hourMaValue:0,
				hourMa2: new SMA2({period : ma2Periods, values : []}),
				hourMa2Value:0,
				hourAdx: new ADX({period : adxPeriods, close:[], high:[], low:[]}),
				hourAdxValue: 0,
				hourAtr: new ATR({period : atrPeriods, close:[], high:[], low:[]}),
				hourAtrValue: 0 ,
				hourPrevMaValue:0,
				threeHourOpen: - Infinity,
				threeHourHigh: - Infinity,
				threeHourLow: Infinity,
				threeHourClose: - Infinity,
				threeHourPrevOpen: - Infinity,
				threeHourPrevHigh: - Infinity,
				threeHourPrevLow: Infinity,
				threeHourPrevClose: - Infinity,
				threeHourThirdOpen: - Infinity,
				threeHourThirdHigh: - Infinity,
				threeHourThirdLow: Infinity,
				threeHourThirdClose: - Infinity,
				threeHourMa: new SMA({period : maPeriods, values : []}),
				threeHourMaValue:0,
				threeHourMa2: new SMA2({period : ma2Periods, values : []}),
				threeHourMa2Value:0,
				threeHourAdx: new ADX({period : adxPeriods, close:[], high:[], low:[]}),
				threeHourAdxValue: 0,
				threeHourAtr: new ATR({period : atrPeriods, close:[], high:[], low:[]}),
				threeHourAtrValue: 0 ,
				threeHourPrevMaValue:0,
				dayOpen: - Infinity,
				dayHigh: - Infinity,
				dayLow: Infinity,
				dayClose: - Infinity,
				dayPrevOpen: - Infinity,
				dayPrevHigh: - Infinity,
				dayPrevLow: Infinity,
				dayPrevClose: - Infinity,
				dayThirdOpen: - Infinity,
				dayThirdHigh: - Infinity,
				dayThirdLow: Infinity,
				dayThirdClose: - Infinity,
				dayMa: new SMA({period : maPeriods, values : []}),
				dayMaValue:0,
				dayMa2: new SMA2({period : ma2Periods, values : []}),
				dayMa2Value:0,
				dayAdx: new ADX({period : adxPeriods, close:[], high:[], low:[]}),
				dayAdxValue: 0,
				dayAtr: new ATR({period : atrPeriods, close:[], high:[], low:[]}),
				dayAtrValue: 0 ,
				dayPrevMaValue:0,

			}	
	}

	for(pair in pairs){
		bfx.pairSetup(pair, function(pair, ticker) {
			if (pairs[pair]['lastPrice'] != undefined){
				pairs[pair]['preVLastPrice'] = pairs[pair]['lastPrice'];
				pairs[pair]['prevBidPrice'] = pairs[pair]['bidPrice'];
				pairs[pair]['prevAskPrice'] = pairs[pair]['askPrice'];
				pairs[pair]['prevDayHighPrice'] = pairs[pair]['dayHighPrice'];
				pairs[pair]['prevDayLowPrice'] = pairs[pair]['dayLowPrice'];
				pairs[pair]['prevVolume'] = pairs[pair]['volume'];
				pairs[pair]['prevDayChange'] = pairs[pair]['dayChange'];
				pairs[pair]['prevDayChangePct'] = pairs[pair]['dayChangePct'];	
			}
			console.log(pair,'s Setup prices: ', ticker.lastPrice)
			if ('t'+pair == ticker.symbol){
				pairs[pair]['lastPrice'] = ticker['lastPrice'];
				pairs[pair]['bidPrice'] = ticker['bid'];
				pairs[pair]['askPrice'] = ticker['ask'];
				pairs[pair]['dayHighPrice'] = ticker['high'];
				pairs[pair]['dayLowPrice'] = ticker['low'];
				pairs[pair]['volume'] = ticker['volume'];
				pairs[pair]['dayChange'] = ticker['dailyChange'];
				pairs[pair]['dayChangePct'] = ticker['dailyChangePerc'];
				console.log('___',pair,' ticker update: ', pairs[pair]['dayChangePct'])
			}

		})
		bfx.getHistData(pair, function(pair, data){
			pairs[pair]['open'] = data[0].open;
			pairs[pair]['high'] = data[0].high;
			pairs[pair]['low'] = data[0].low;
			pairs[pair]['close'] = data[0].close;
			pairs[pair]['prevOpen'] = data[1].open;
			pairs[pair]['prevHigh'] = data[1].high;
			pairs[pair]['prevLow'] = data[1].low;
			pairs[pair]['prevClose'] = data[1].close;
			pairs[pair]['thirdOpen'] = data[2].open;
			pairs[pair]['thirdHigh'] = data[2].high;
			pairs[pair]['thirdLow'] = data[2].low;
			pairs[pair]['thirdClose'] = data[2].close;

			pairs[pair]['candlePerc'] = -100 + (pairs[pair]['close']/pairs[pair]['open'])* 100;
			pairs[pair]['prevCandlePerc'] = -100 + (pairs[pair]['close']/pairs[pair]['prevLow'])* 100;
			pairs[pair]['thirdCandlePerc'] = -100 + (pairs[pair]['close']/pairs[pair]['thirdLow'])* 100;
			pairs[pair]['latestPerc'] = -100 + (pairs[pair]['lastPrice']/pairs[pair]['low'])* 100;			

			var carray = [];
			var harray = [];
			var larray = [];

			for(var d of data){
				carray.push(d['close']);
				harray.push(d['high']);
				larray.push(d['low']);
				// console.log('Historical candle closes: ',carray, 'Highs ', harray, 'lows ', larray)
			}

			//console.log(resppair, carray);
			pairs[pair]['ma'] = new SMA({period : tmaPeriods, values : carray});
			pairs[pair]['ma2'] = new SMA2({period : tma2Periods, values : carray});
			pairs[pair]['adx'] = new ADX({period : tadxPeriods, close : carray, high : harray, low : larray });
			pairs[pair]['atr'] = new ATR({period : tatrPeriods, close : carray, high : harray, low : larray });
			//console.log(pairs);
			// console.log('1m Current',pair, round(pairs[pair]['latestPerc'],4),'%',', 1c%:',round(pairs[pair]['candlePerc'],4));
			// console.log(', 2c%:', round(pairs[pair]['prevCandlePerc'],4),', 3c%',round(pairs[pair]['thirdCandlePerc'],4));
			// console.log('___',pair,'moving average: ',round(pairs[pair]['ma'].price[0],5), ', price:', round(pairs[pair]['lastPrice'],5));
		})

		bfx.getFifteenCandles(pair, function(pair, candles){
		   	pairs[pair]['fifteenOpen'] = candles[0].open;
			pairs[pair]['fifteenHigh'] = candles[0].high;
			pairs[pair]['fifteenLow'] = candles[0].low;
			pairs[pair]['fifteenClose'] = candles[0].close;
			pairs[pair]['fifteenPrevOpen'] = candles[1].open;
			pairs[pair]['fifteenPrevHigh'] = candles[1].high;
			pairs[pair]['fifteenPrevLow'] = candles[1].low;
			pairs[pair]['fifteenPrevClose'] = candles[1].close;
			pairs[pair]['fifteenThirdOpen'] = candles[2].open;
			pairs[pair]['fifteenThirdHigh'] = candles[2].high;
			pairs[pair]['fifteenThirdLow'] = candles[2].low;
			pairs[pair]['fifteenThirdClose'] = candles[2].close;

			pairs[pair]['fifteenCandlePerc'] = -100 + (pairs[pair]['fifteenClose']/pairs[pair]['fifteenOpen'])* 100;
			pairs[pair]['fifteenPrevCandlePerc'] = -100 + (pairs[pair]['fifteenClose']/pairs[pair]['fifteenPrevLow'])* 100;
			pairs[pair]['fifteenThirdCandlePerc'] = -100 + (pairs[pair]['fifteenClose']/pairs[pair]['fifteenThirdLow'])* 100;
			pairs[pair]['fifteenLatestPerc'] = -100 + (pairs[pair]['lastPrice']/pairs[pair]['fifteenLow'])* 100;
			
			var carray = [];
			var harray = [];
			var larray = [];

			for(var d of candles){
				carray.push(d['close']);
				harray.push(d['high']);
				larray.push(d['low']);
				// console.log('Historical candle closes: ',carray, 'Highs ', harray, 'lows ', larray)
			}

			//console.log(resppair, carray);
			pairs[pair]['fifteenMa'] = new SMA({period : maPeriods, values : carray});
			pairs[pair]['fifteenMa2'] = new SMA2({period : ma2Periods, values : carray});
			pairs[pair]['fifteenAdx'] = new ADX({period : adxPeriods, close : carray, high : harray, low : larray });
			pairs[pair]['fifteenAtr'] = new ATR({period : atrPeriods, close : carray, high : harray, low : larray });
			//console.log(pairs);
			console.log('15m Current',pair, round(pairs[pair]['fifteenLatestPerc'],4),'%',', 1c%:',round(pairs[pair]['fifteenCandlePerc'],4));
			console.log(', 2c%:', round(pairs[pair]['fifteenPrevCandlePerc'],4),', 3c%',round(pairs[pair]['fifteenThirdCandlePerc'],4));
			console.log('___',pair,'moving average: ',round(pairs[pair]['fifteenMa'].price[0],5), ', price:', round(pairs[pair]['lastPrice'],5));
		})

		bfx.getHourCandles(pair, function(pair, candles){
	 	    pairs[pair]['hourOpen'] = candles[0].open;
			pairs[pair]['hourHigh'] = candles[0].high;
			pairs[pair]['hourLow'] = candles[0].low;
			pairs[pair]['hourClose'] = candles[0].close;
			pairs[pair]['hourPrevOpen'] = candles[1].open;
			pairs[pair]['hourPrevHigh'] = candles[1].high;
			pairs[pair]['hourPrevLow'] = candles[1].low;
			pairs[pair]['hourPrevClose'] = candles[1].close;
			pairs[pair]['hourThirdOpen'] = candles[2].open;
			pairs[pair]['hourThirdHigh'] = candles[2].high;
			pairs[pair]['hourThirdLow'] = candles[2].low;
			pairs[pair]['hourThirdClose'] = candles[2].close;

			pairs[pair]['hourCandlePerc'] = -100 + (pairs[pair]['hourClose']/pairs[pair]['hourOpen'])* 100;
			pairs[pair]['hourPrevCandlePerc'] = -100 + (pairs[pair]['hourClose']/pairs[pair]['hourPrevLow'])* 100;
			pairs[pair]['hourThirdCandlePerc'] = -100 + (pairs[pair]['hourClose']/pairs[pair]['hourThirdLow'])* 100;
			pairs[pair]['hourLatestPerc'] = -100 + (pairs[pair]['lastPrice']/pairs[pair]['hourLow'])* 100;
			
			var carray = [];
			var harray = [];
			var larray = [];

			for(var d of candles){
				carray.push(d['close']);
				harray.push(d['high']);
				larray.push(d['low']);
				// console.log('Historical candle closes: ',carray, 'Highs ', harray, 'lows ', larray)
			}

			//console.log(resppair, carray);
			pairs[pair]['hourMa'] = new SMA({period : maPeriods, values : carray});
			pairs[pair]['hourMa2'] = new SMA2({period : ma2Periods, values : carray});
			pairs[pair]['hourAdx'] = new ADX({period : adxPeriods, close : carray, high : harray, low : larray });
			pairs[pair]['hourAtr'] = new ATR({period : atrPeriods, close : carray, high : harray, low : larray });
			//console.log(pairs);
			console.log('1h Current',pair, round(pairs[pair]['hourLatestPerc'],4),'%',', 1c%:',round(pairs[pair]['hourCandlePerc'],4));
			console.log(', 2c%:', round(pairs[pair]['hourPrevCandlePerc'],4),', 3c%',round(pairs[pair]['hourThirdCandlePerc'],4));
			console.log('___',pair,'moving average: ',round(pairs[pair]['hourMa'].price[0],5), ', price:', round(pairs[pair]['lastPrice'],5));
		})

		bfx.getThreeHourCandles(pair, function(pair, candles){
			pairs[pair]['threeHourOpen'] = candles[0].open;
			pairs[pair]['threeHourHigh'] = candles[0].high;
			pairs[pair]['threeHourLow'] = candles[0].low;
			pairs[pair]['threeHourClose'] = candles[0].close;
			pairs[pair]['threeHourPrevOpen'] = candles[1].open;
			pairs[pair]['threeHourPrevHigh'] = candles[1].high;
			pairs[pair]['threeHourPrevLow'] = candles[1].low;
			pairs[pair]['threeHourPrevClose'] = candles[1].close;
			pairs[pair]['threeHourThirdOpen'] = candles[2].open;
			pairs[pair]['threeHourThirdHigh'] = candles[2].high;
			pairs[pair]['threeHourThirdLow'] = candles[2].low;
			pairs[pair]['threeHourThirdClose'] = candles[2].close;

			pairs[pair]['threeHourCandlePerc'] = -100 + (pairs[pair]['threeHourClose']/pairs[pair]['threeHourOpen'])* 100;
			pairs[pair]['threeHourPrevCandlePerc'] = -100 + (pairs[pair]['threeHourClose']/pairs[pair]['threeHourPrevLow'])* 100;
			pairs[pair]['threeHourThirdCandlePerc'] = -100 + (pairs[pair]['threeHourClose']/pairs[pair]['threeHourThirdLow'])* 100;
			pairs[pair]['threeHourLatestPerc'] = -100 + (pairs[pair]['lastPrice']/pairs[pair]['threeHourLow'])* 100;
			
			var carray = [];
			var harray = [];
			var larray = [];

			for(var d of candles){
				carray.push(d['close']);
				harray.push(d['high']);
				larray.push(d['low']);
				// console.log('Historical candle closes: ',carray, 'Highs ', harray, 'lows ', larray)
			}

			//console.log(resppair, carray);
			pairs[pair]['threeHourMa'] = new SMA({period : maPeriods, values : carray});
			pairs[pair]['threeHourMa2'] = new SMA2({period : ma2Periods, values : carray});
			pairs[pair]['threeHourAdx'] = new ADX({period : adxPeriods, close : carray, high : harray, low : larray });
			pairs[pair]['threeHourAtr'] = new ATR({period : atrPeriods, close : carray, high : harray, low : larray });
			//console.log(pairs);
			console.log('3h Current',pair, round(pairs[pair]['threeHourLatestPerc'],4),'%',', 1c%:',round(pairs[pair]['threeHourCandlePerc'],4));
			console.log(', 2c%:', round(pairs[pair]['threeHourPrevCandlePerc'],4),', 3c%',round(pairs[pair]['threeHourThirdCandlePerc'],4));
			console.log('___',pair,'moving average: ',round(pairs[pair]['threeHourMa'].price[0],5), ', price:', round(pairs[pair]['lastPrice'],5));
		})

		bfx.getDayCandles(pair, function(pair, candles){
			pairs[pair]['dayOpen'] = candles[0].open;
			pairs[pair]['dayHigh'] = candles[0].high;
			pairs[pair]['dayLow'] = candles[0].low;
			pairs[pair]['dayClose'] = candles[0].close;
			pairs[pair]['dayPrevOpen'] = candles[1].open;
			pairs[pair]['dayPrevHigh'] = candles[1].high;
			pairs[pair]['dayPrevLow'] = candles[1].low;
			pairs[pair]['dayPrevClose'] = candles[1].close;
			pairs[pair]['dayThirdOpen'] = candles[2].open;
			pairs[pair]['dayThirdHigh'] = candles[2].high;
			pairs[pair]['dayThirdLow'] = candles[2].low;
			pairs[pair]['dayThirdClose'] = candles[2].close;

			pairs[pair]['dayCandlePerc'] = -100 + (pairs[pair]['dayClose']/pairs[pair]['dayOpen'])* 100;
			pairs[pair]['dayPrevCandlePerc'] = -100 + (pairs[pair]['dayClose']/pairs[pair]['dayPrevLow'])* 100;
			pairs[pair]['dayThirdCandlePerc'] = -100 + (pairs[pair]['dayClose']/pairs[pair]['dayThirdLow'])* 100;
			pairs[pair]['dayLatestPerc'] = -100 + (pairs[pair]['lastPrice']/pairs[pair]['dayLow'])* 100;
			
			var carray = [];
			var harray = [];
			var larray = [];

			for(var d of candles){
				carray.push(d['close']);
				harray.push(d['high']);
				larray.push(d['low']);
				// console.log('Historical candle closes: ',carray, 'Highs ', harray, 'lows ', larray)
			}

			//console.log(resppair, carray);
			pairs[pair]['dayMa'] = new SMA({period : maPeriods, values : carray});
			pairs[pair]['dayMa2'] = new SMA2({period : ma2Periods, values : carray});
			pairs[pair]['dayAdx'] = new ADX({period : adxPeriods, close : carray, high : harray, low : larray });
			pairs[pair]['dayAtr'] = new ATR({period : atrPeriods, close : carray, high : harray, low : larray });
			//console.log(pairs);
			console.log('1D Current',pair, round(pairs[pair]['dayLatestPerc'],4),'%',', 1c%:',round(pairs[pair]['dayCandlePerc'],4));
			console.log(', 2c%:', round(pairs[pair]['dayPrevCandlePerc'],4),', 3c%',round(pairs[pair]['dayThirdCandlePerc'],4));
			console.log('___',pair,'moving average: ',round(pairs[pair]['dayMa'].price[0],5), ', price:', round(pairs[pair]['lastPrice'],5));
		})

		console.log('----------Initialising bot----------');
		console.log('Bot for ', pair)

		console.log('-----------------------------------------------------------------');
		if (pair != undefined) {
			console.log('----------Initialising bot----------');
			console.log('Bot for ', pair, ' MA: ', pairs[pair]['ma'].price[0], ' MA2: ', pairs[pair]['ma2'].price[0])
			
			console.log('-----------------------------------------------------------------');
			//30 minute delay time = 1800000
			var delay = 10000 - Date.now()%10000;
			console.log('trading starts in ', delay/10000, ' minutes');
			console.log('-----------------------------------------------------------------');
			console.log('-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-');

			setTimeout(function(){
				for(var pair in pairs){
					// bfx.getPrices(pair);
					updateIndicators(pair, bfx.prices);
					}

				setInterval(function(){
					for(var pair in pairs){
						// bfx.getPrices(pair);
					updateIndicators(pair, bfx.prices);
					// bfx.resetPrices(pair);
					}
				}, 6000);

				setInterval(function(){
					for(var pair in pairs){
						// bfx.getPrices(pair);
						findTradeOpportunity(pair, bfx.prices);
					}
				}, 4000);
			}, delay);
			// bfx.gIOTistData();
		}
	}

}

// function runTrader(){

// }

/**
	start bot
	**/
Manager.prototype.runbot = function(pair, pairs){

	initPairs()

}

function updateIndicators(pair, prices){
	// console.log(pair, 'MA value: ', pairs[pair]['maValue'], 'MA2 value: ', pairs[pair]['ma2Value'],
	// 	'ADX Value: ', pairs[pair]['adxValue'], 'ATR Value: ',pairs[pair]['atrValue']);
	// console.log('Prices going in: ',prices[pair]['close'], prices[pair]['low'], prices[pair]['high'])
	if (pair != undefined){
		pairs[pair]['maValue'] = pairs[pair]['ma'].nextValue(pairs[pair]['close']);
		pairs[pair]['ma2Value'] = pairs[pair]['ma2'].nextValue(pairs[pair]['close']);
		pairs[pair]['adxValue'] = pairs[pair]['adx'].nextValue({close: pairs[pair]['close'], high: pairs[pair]['high'], low: pairs[pair]['low']});
		pairs[pair]['atrValue'] = pairs[pair]['atr'].nextValue({close: pairs[pair]['close'], high: pairs[pair]['high'], low: pairs[pair]['low']});

		pairs[pair]['fifteenMaValue'] = pairs[pair]['fifteenMa'].nextValue(pairs[pair]['close']);
		pairs[pair]['fifteenMa2Value'] = pairs[pair]['fifteenMa2'].nextValue(pairs[pair]['close']);
		pairs[pair]['fifteenAdxValue'] = pairs[pair]['fifteenAdx'].nextValue({close: pairs[pair]['fifteenClose'], high: pairs[pair]['fifteenHigh'], low: pairs[pair]['fifteenLow']});
		pairs[pair]['fifteenAtrValue'] = pairs[pair]['fifteenAtr'].nextValue({close: pairs[pair]['fifteenClose'], high: pairs[pair]['fifteenHigh'], low: pairs[pair]['fifteenLow']});
		
		pairs[pair]['hourMaValue'] = pairs[pair]['hourMa'].nextValue(pairs[pair]['close']);
		pairs[pair]['hourMa2Value'] = pairs[pair]['hourMa2'].nextValue(pairs[pair]['close']);
		pairs[pair]['hourAdxValue'] = pairs[pair]['hourAdx'].nextValue({close: pairs[pair]['hourClose'], high: pairs[pair]['hourHigh'], low: pairs[pair]['hourLow']});
		pairs[pair]['hourAtrValue'] = pairs[pair]['hourAtr'].nextValue({close: pairs[pair]['hourClose'], high: pairs[pair]['hourHigh'], low: pairs[pair]['hourLow']});
		
		pairs[pair]['threeHourMaValue'] = pairs[pair]['threeHourMa'].nextValue(pairs[pair]['close']);
		pairs[pair]['threeHourMa2Value'] = pairs[pair]['threeHourMa2'].nextValue(pairs[pair]['close']);
		pairs[pair]['threeHourAdxValue'] = pairs[pair]['threeHourAdx'].nextValue({close: pairs[pair]['threeHourClose'], high: pairs[pair]['threeHourHigh'], low: pairs[pair]['threeHourLow']});
		pairs[pair]['threeHourAtrValue'] = pairs[pair]['threeHourAtr'].nextValue({close: pairs[pair]['threeHourClose'], high: pairs[pair]['threeHourHigh'], low: pairs[pair]['threeHourLow']});
		
		pairs[pair]['dayMaValue'] = pairs[pair]['dayMa'].nextValue(pairs[pair]['close']);
		pairs[pair]['dayMa2Value'] = pairs[pair]['dayMa2'].nextValue(pairs[pair]['close']);
		pairs[pair]['dayAdxValue'] = pairs[pair]['dayAdx'].nextValue({close: pairs[pair]['dayClose'], high: pairs[pair]['dayHigh'], low: pairs[pair]['dayLow']});
		pairs[pair]['dayAtrValue'] = pairs[pair]['dayAtr'].nextValue({close: pairs[pair]['dayClose'], high: pairs[pair]['dayHigh'], low: pairs[pair]['dayLow']});
		
		if(pairs[pair]['maValue'] != undefined && pairs[pair]['ma2Value'] != undefined && pairs[pair]['adxValue'] && pairs[pair]['atrValue']) {
			// findTradeOpportunity(pair, prices);
			pairs[pair]['prevMaValue'] = pairs[pair]['maValue'];
			pairs[pair]['prevMa2Value'] = pairs[pair]['ma2Value'];
			pairs[pair]['fifteenPrevMaValue'] = pairs[pair]['fifteenMaValue'];
			pairs[pair]['fifteenPrevMa2Value'] = pairs[pair]['fifteenMa2Value'];
			pairs[pair]['hourPrevMaValue'] = pairs[pair]['hourMaValue'];
			pairs[pair]['hourPrevMa2Value'] = pairs[pair]['hourMa2Value'];
			pairs[pair]['threeHourPrevMaValue'] = pairs[pair]['threeHourMaValue'];
			pairs[pair]['threeHourPrevMa2Value'] = pairs[pair]['threeHourMa2Value'];
			pairs[pair]['dayPrevMaValue'] = pairs[pair]['dayMaValue'];
			pairs[pair]['dayPrevMa2Value'] = pairs[pair]['dayMa2Value'];
			// console.log('Previous price: ', pairs[pair]['prevPrice'], 'ADX Value: ', pairs[pair]['adxValue'], 'ATR Value: ', pairs[pair]['atrValue']);
		}
	}
		
};

function findTradeOpportunity(pair, prices){
console.log('____________________________________________________________');
console.log('Analysing...', pair, pairs[pair]['lastPrice']);
console.log('ALT sell @:', round(pairs[pair]['ALTSellLevel'],7), ',', 'BTC sell @:',round(pairs[pair]['BTCSellLevel'],7));
console.log('1h Current',pair, round(pairs[pair]['hourLatestPerc'],4),'%',', 1c%:',round(pairs[pair]['hourCandlePerc'],4));
console.log('2c%:', round(pairs[pair]['hourPrevCandlePerc'],4),', 3c%',round(pairs[pair]['hourThirdCandlePerc'],4));
console.log('Fast MA - 15m:',pairs[pair]['fifteenMa'].price[0],'1hr:',pairs[pair]['hourMa'].price[0] ,'Day:',pairs[pair]['dayMa'].price[0]);
console.log('Slow MA - 15m:',pairs[pair]['fifteenMa2'].price[0],'1hr:',pairs[pair]['hourMa2'].price[0],'Day:',pairs[pair]['dayMa2'].price[0])
console.log('15m ADX:',round(pairs[pair]['fifteenAdxValue'].adx, 4), 'ATR:', round(pairs[pair]['fifteenAtrValue'], 4))
console.log('1hr ADX:',round(pairs[pair]['hourAdxValue'].adx, 4), 'ATR:', round(pairs[pair]['hourAtrValue'], 4))
console.log('OHLC - 15m - open:',pairs[pair]['fifteenOpen'], 'high:',pairs[pair]['fifteenHigh'], 'low:',pairs[pair]['fifteenLow'], 'close:',pairs[pair]['fifteenClose']);
console.log('OHLC - 1hr - open:',pairs[pair]['hourOpen'], 'high:',pairs[pair]['hourHigh'], 'low:',pairs[pair]['hourLow'], 'close:',pairs[pair]['hourClose']);
console.log('OHLC - 3hr - open:',pairs[pair]['threeHourOpen'], 'high:',pairs[pair]['threeHourHigh'], 'low:',pairs[pair]['threeHourLow'], 'close:',pairs[pair]['threeHourClose']);
console.log('OHLC - Day - open:',pairs[pair]['dayOpen'], 'high:',pairs[pair]['dayHigh'], 'low:',pairs[pair]['dayLow'], 'close:',pairs[pair]['dayClose']);	

	if (pairs[pair]['close'] !== pairs[pair]['prevClose']) {
		if (pairs[pair]['close'] > pairs[pair]['prevClose']*1.01 && pairs[pair]['close'] > pairs[pair]['prevOpen'] 
			&& pairs[pair]['close'] > pairs[pair]['ALTSellLevel']){
			pairs[pair]['sellPrice'] = pairs[pair]['close'];
			
			if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = 0 - (pairs[pair]['close']/pairs[pair]['open']);
			} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = 0 - (pairs[pair]['close']/pairs[pair]['open']);
			}

			pairs[pair]['sellALT']++;
			openSellALTPosition(pair, pairs, 'sellALT');
			console.log('-----------------------------------------------------------------------');
			console.log(pair, ' selling ALT @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount']);
			console.log('-----------------------------------------------------------------------');

		} else if (pairs[pair]['close'] < pairs[pair]['prevClose']*0.99 && pairs[pair]['close'] < pairs[pair]['prevOpen']
			&& pairs[pair]['close'] < pairs[pair]['BTCSellLevel']){
			pairs[pair]['sellPrice'] = pairs[pair]['close'];

			if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['close']);
			} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['close']);
			}

			pairs[pair]['sellBTC']++;
			openSellBTCPosition(pair, pairs, 'sellBTC');
			console.log('-----------------------------------------------------------------------');
			console.log(pair, ' Selling Bitcoin @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount']);
			console.log('-----------------------------------------------------------------------');

		}

		// if (pairs[pair]['close'] > pairs[pair]['maValue'] && pairs[pair]['prevClose'] < pairs[pair]['maValue']) {
		// 	pairs[pair]['sellPrice'] = pairs[pair]['close'];

		// 	if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
		// 		pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['prevClose']);
		// 	} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
		// 		pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['prevClose']);
		// 	}

		// 	pairs[pair]['sellBTC']++;
		// 	openSellBTCPosition(pair, pairs, pairs, 'sellBTC');
		// 	console.log('-----------------------------------------------------------------------');
		// 	console.log(pair, ' Moving average crossed, selling Bitcoin @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount'], 
		// 		'MA value: ',pairs[pair]['maValue'],' Previous close: ',pairs[pair]['prevClose']);
		// 	console.log('-----------------------------------------------------------------------');
		// } else if (pairs[pair]['close'] < pairs[pair]['maValue'] && pairs[pair]['open'] > pairs[pair]['maValue']){
		// 	if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
		// 		pairs[pair]['sellAmount'] = 0 - (pairs[pair]['prevClose']/pairs[pair]['open']);
		// 	} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
		// 		pairs[pair]['sellAmount'] = 0 - (pairs[pair]['prevClose']/pairs[pair]['open']);
		// 	}

		// 	pairs[pair]['sellALT']++;
		// 	openSellALTPosition(pair, pairs, pairs, 'sellALT');
		// 	console.log('-----------------------------------------------------------------------');
		// 	console.log(pair, ' Moving average crossed, selling ALT @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount'], 
		// 		'MA value: ',pairs[pair]['maValue'],' Previous close: ',pairs[pair]['prevClose']);
		// 	console.log('-----------------------------------------------------------------------');

		// 	pairs[pair]['sellPrice'] = pairs[pair]['close'];
		// }

	};


	if (pairs[pair]['lastPrice'] > pairs[pair]['ALTSellLevel']){
			pairs[pair]['sellPrice'] = pairs[pair]['lastPrice'];
			if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = 0 - (pairs[pair]['lastPrice']/pairs[pair]['open']);
			} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = 0 - (pairs[pair]['lastPrice']/pairs[pair]['open']);
			}
			pairs[pair]['ALTSellLevel'] = pairs[pair]['askPrice'];
			pairs[pair]['BTCSellLevel'] = pairs[pair]['bidPrice'];
			pairs[pair]['sellALT']++;
			openSellALTPosition(pair, pairs, 'sellALT');
			console.log('-----------------------------------------------------------------------');
			console.log(pair, ' IOT SPIKE sold @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount']);
			console.log('-----------------------------------------------------------------------');

	} else if (pairs[pair]['lastPrice'] < pairs[pair]['BTCSellLevel']){
			pairs[pair]['sellPrice'] = pairs[pair]['close'];
			if (pairs[pair]['maValue'] > pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['lastPrice']);
			} else if (pairs[pair]['maValue'] < pairs[pair]['ma2Value']){
				pairs[pair]['sellAmount'] = (pairs[pair]['open']/pairs[pair]['lastPrice']);
			}
			pairs[pair]['ALTSellLevel'] = pairs[pair]['askPrice'];
			pairs[pair]['BTCSellLevel'] = pairs[pair]['bidPrice'];
			pairs[pair]['sellBTC']++;
			openSellBTCPosition(pair, pairs, 'sellBTC');
			console.log('-----------------------------------------------------------------------');
			console.log(pair, ' Bitcoin SPIKE sold @ ', pairs[pair]['sellPrice'], pairs[pair]['sellAmount']);
			console.log('-----------------------------------------------------------------------');
	}

	if (pairs[pair]['ALTSellLevel'] == Infinity){
		pairs[pair]['ALTSellLevel'] = pairs[pair]['askPrice']* 1.02;
		pairs[pair]['BTCSellLevel'] = pairs[pair]['bidPrice']* 0.98;
	}
	pairs[pair]['prevPrice'] = pairs[pair]['lastPrice'];	
};

function openSellALTPosition(pair, pairs, pairs, action){
	console.log('inside selling ALT function', pairs[pair]['lastPrice'], pairs[pair]['sellAmount']);	
	console.log('££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££');
	if ('sellALT'){
		pairs[pair]['ALTSellLevel'] = pairs[pair]['askPrice']* 1.02;
		pairs[pair]['BTCSellLevel'] = pairs[pair]['bidPrice']* 0.99;	
	}

	bfx.trade(pair, pairs, action, 'sellALT', function(){
		console.log('ALT purchase log ', pairs[pair]['sellAmount'], pairs[pair]['sellPrice']);
		console.log('inside ALT trade function');
		
		pairs[pair]['sellALT'] = true;
		pairs[pair]['sellPrice'] = pairs[pair]['close'];
		openedPositions++;
		console.log(pair, ' Sold ALT at ', pairs[pair]['sellPrice'], ' Amount ', amount);
		console.log('---------------------------------------------------------');
		// console.log(pair, 'Trade was not successful');	
	});	
	
}

function openSellBTCPosition(pair, pairs, pairs, action){
	console.log('inside selling BTC function', pairs[pair]['lastPrice'], pairs[pair]['sellAmount']);
	console.log('££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££');
	if ('sellBTC'){
		pairs[pair]['ALTSellLevel'] = pairs[pair]['askPrice']* 1.01
		pairs[pair]['BTCSellLevel'] = pairs[pair]['bidPrice']* 0.98;	
	}

	bfx.trade(pair, pairs, action, 'sellBTC', function(){
		console.log('Bitcoin purchase log ', pairs[pair]['sellAmount'], pairs[pair]['sellPrice']);
		console.log('inside BTC trade function');
		
		pairs[pair]['sellBTC'] = true;
		pairs[pair]['sellPrice'] = pairs[pair]['close'];
		openedPositions++;
		console.log(pair, ' Sold BTC at ', pairs[pair]['sellPrice'], ' Amount ', amount);
		console.log('---------------------------------------------------------')
		// console.log(pair, 'Trade was not successful'); 	
	});
	
}


function getPositionSize(pair, price, amount){

	var close = pairs['pair']['close'];
	var open = pairs['pair']['open'];

	if (close > open){
		//How much IOT will we sell?
		var difference = (close*open) * 100

	} else {
		//How much BTC will we sell?
		var difference = (close*open) * 100
	}

	var positionSize = difference;
	return positionSize;
}

module.exports = Manager;

