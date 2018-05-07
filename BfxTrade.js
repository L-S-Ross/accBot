
const request = require('request');
const bfx = require('./bfx')
const ws = bfx.ws(2, {
  manageCandles: true,  // enable candle dataset persistence/management
  transform: true       // converts ws data arrays to Candle models (and others)
})

var IOTWallet = {};
var BTCWallet = {};
var ETHWallet = {};
var NEOWallet = {};
var USDWallet = {};

var IOTBalance = 0;
var BTCBalance = 0;
var ETHBalance = 0;
var NEOBalance = 0;
var USDBalance = 0;

function BfxTrade(pair, pairs){
	this.initAmount = 100;
	this.reserve={};
	this.prices={};
	this.orderChecks = {};

	const CANDLE_KEY = 'trade:1m:t'+pair;
	const CANDLE_KEY15m = 'trade:15m:t'+pair;
	const CANDLE_KEY1h = 'trade:1h:t'+pair;
	const CANDLE_KEY3h = 'trade:3h:t'+pair;
	const CANDLE_KEY1D = 'trade:1D:t'+pair;

	process.env.DEBUG = 'bfx:examples:*'
	const debug = require('debug')('bfx:examples:ws2_auth')
	
	ws.on('open', () => { // wait for socket open
	  ws.auth()           // & authenticate
	  console.log('open')
	});
	ws.on('error', (err) => {
	  console.log('error: %j', err)
	});
	ws.once('auth', () => {
		console.log('authenticated')
		// do something with authenticated ws stream
	  	ws.onWalletSnapshot({}, (wallets) => {
	
		balances = JSON.stringify(wallets)
		blist = JSON.parse(balances)
		// console.log(blist)

		function isBTC(wallet) { 
	    	return wallet.currency === 'BTC' && wallet.type === 'exchange';
		}
		BTCWallet = blist.find(isBTC);
		BTCBalance = BTCWallet.balance;

		function isIOT(wallet) { 
	    	return wallet.currency === 'IOT' && wallet.type === 'exchange';
		}
		IOTWallet = blist.find(isIOT);
		IOTBalance = IOTWallet.balance;

		function isETH(wallet) { 
	    	return wallet.currency === 'ETH' && wallet.type === 'exchange';
		}
		ETHWallet = blist.find(isETH);
		ETHBalance = ETHWallet.balance;

		function isNEO(wallet) { 
	    	return wallet.currency === 'NEO' && wallet.type === 'exchange';
		}
		NEOWallet = blist.find(isNEO);
		NEOBalance = NEOWallet.balance;

		console.log('SNAPSHOT IOT Wallet balance ', IOTBalance, 'SNAPSHOT '); 
		console.log('SNAPSHOT BTC Wallet balance ', BTCBalance, 'SNAPSHOT '); 
		console.log('SNAPSHOT ETH Wallet balance ', ETHBalance, 'SNAPSHOT '); 
		console.log('SNAPSHOT NEO Wallet balance ', NEOBalance, 'SNAPSHOT '); 

		})

  		ws.onWalletUpdate({}, (wallets) => {
			console.log(wallets);
			balances = JSON.stringify(wallets)

			if (balances != undefined){
				blist = JSON.parse(balances)
				console.log('Blist currency:', blist.currency, blist.type, blist.balance);
				Wallet = blist.currency;
				Balance = blist.balance;

				if (Wallet === 'BTC' && blist.type === 'exchange'){
					BTCBalance = blist.balance;
				}	 			 
				if (Wallet === 'IOT' && blist.type === 'exchange'){
					IOTBalance = blist.balance;
				}
				if (Wallet === 'ETH' && blist.type === 'exchange'){
					ETHBalance = blist.balance;
				}
				if (Wallet === 'NEO' && blist.type === 'exchange'){
					NEOBalance = blist.balance;
				}
			} 
			console.log('IOT Wallet balance ', IOTBalance); 
			console.log('BTC Wallet balance ', BTCBalance); 
			console.log('ETH Wallet balance ', ETHBalance); 
			console.log('NEO Wallet balance ', NEOBalance); 
		})
	});
};

BfxTrade.prototype.pairSetup = function(pair, callback) {

	const CANDLE_KEY = 'trade:1m:t'+pair;
	const CANDLE_KEY15m = 'trade:15m:t'+pair;
	const CANDLE_KEY1h = 'trade:1h:t'+pair;
	const CANDLE_KEY3h = 'trade:3h:t'+pair;
	const CANDLE_KEY1D = 'trade:1D:t'+pair;

	process.env.DEBUG = 'bfx:examples:*'
	const debug = require('debug')('bfx:examples:ws2_auth')
	var self = this;
	
	ws.on('error', (err) => {
	  console.log('error: %j', err)
	});
	// ws.once('auth', () => {
	ws.on('open', () => {
	  console.log('Pair setup authenticated')
	  // do somIOTing with authenticated ws stream

		// var self = this;
		console.log('Getting candles for', pair);
		
	 	ws.subscribeCandles(CANDLE_KEY);
	 	console.log('Subscribing to ticker for', pair);

	 	ws.subscribeCandles(CANDLE_KEY15m);
	 	console.log('Subscribing to ticker for', pair, ':', CANDLE_KEY15m);

	 	ws.subscribeCandles(CANDLE_KEY1h);
	 	console.log('Subscribing to ticker for', pair, ':', CANDLE_KEY1h);

	 	ws.subscribeCandles(CANDLE_KEY3h);
	 	console.log('Subscribing to ticker for', pair, ':', CANDLE_KEY3h);

	 	ws.subscribeCandles(CANDLE_KEY1D);
	 	console.log('Subscribing to ticker for', pair, ':', CANDLE_KEY1D);

	 	ws.subscribeTicker('t'+pair);
	 	ws.onTicker({ symbol: 't'+pair }, (ticker) => {
	 	
			return callback(pair, ticker)
	});
});
	//Register a callback for wallets snapshot that comes in (account orders)
	//Handle ticker packets
}

BfxTrade.prototype.getBalance = function(pair, callback){
	
};

BfxTrade.prototype.resetPrices = function(pair){
	// this.prices[pair]['highPrice'] = -Infinity;
	// this.prices[pair]['lowPrice'] = Infinity;
};

BfxTrade.prototype.getHistData = function(pair, callback){

	const CANDLE_KEY = 'trade:1m:t'+pair;
	let prevTS = null
	const debug = require('debug')('bfx:examples:ws2_candles')
	
	// 'candles' here is an array
	ws.onCandle({ key: CANDLE_KEY }, (candles) => {
				
		if (prevTS === null || candles[0].mts > prevTS) {
		    const c = candles[1] // report previous candle
		    debug(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
		      CANDLE_KEY, new Date(c.mts).toLocaleTimeString(),
		      c.open, c.high, c.low, c.close, c.volume,
		      // console.log(candles)
		    )
	    	prevTS = candles[0].mts
		}
		return callback(pair, candles); 
	})
};


BfxTrade.prototype.getFifteenCandles = function(pair, callback){
	const CANDLE_KEY15m = 'trade:15m:t'+pair;
	let prevTS = null
	const debug = require('debug')('bfx:examples:ws2_candles')
	
	ws.onCandle({ key: CANDLE_KEY15m }, (candles) => {	
		if (prevTS === null || candles[0].mts > prevTS) {
		    const c = candles[1] // report previous candle
		    debug(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
		      CANDLE_KEY15m, new Date(c.mts).toLocaleTimeString(),
		      c.open, c.high, c.low, c.close, c.volume,
		      // console.log(candles)
		    )
	    	prevTS = candles[0].mts
		}
	return callback(pair, candles); 
	})
}

BfxTrade.prototype.getHourCandles = function(pair, callback){
	const CANDLE_KEY1h = 'trade:1h:t'+pair;
	let prevTS = null
	const debug = require('debug')('bfx:examples:ws2_candles')
	
	ws.onCandle({ key: CANDLE_KEY1h }, (candles) => {	
		if (prevTS === null || candles[0].mts > prevTS) {
		    const c = candles[1] // report previous candle
		    debug(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
		      CANDLE_KEY1h, new Date(c.mts).toLocaleTimeString(),
		      c.open, c.high, c.low, c.close, c.volume,
		      // console.log(candles)
		    )
	    	prevTS = candles[0].mts
	   
		}
	return callback(pair, candles); 
	})
}

BfxTrade.prototype.getThreeHourCandles = function(pair, callback){
	const CANDLE_KEY3h = 'trade:3h:t'+pair;
	let prevTS = null
	const debug = require('debug')('bfx:examples:ws2_candles')
	
	ws.onCandle({ key: CANDLE_KEY3h }, (candles) => {		
		if (prevTS === null || candles[0].mts > prevTS) {
		    const c = candles[1] // report previous candle
		    debug(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
		      CANDLE_KEY3h, new Date(c.mts).toLocaleTimeString(),
		      c.open, c.high, c.low, c.close, c.volume,
		      // console.log(candles)
		    )
	    	prevTS = candles[0].mts
		}
	return callback(pair, candles); 
	})
}

BfxTrade.prototype.getDayCandles = function(pair, callback){
	const CANDLE_KEY1D = 'trade:1D:t'+pair;
	let prevTS = null
	const debug = require('debug')('bfx:examples:ws2_candles')
	
	ws.onCandle({ key: CANDLE_KEY1D }, (candles) => {	
		if (prevTS === null || candles[0].mts > prevTS) {
		    const c = candles[1] // report previous candle
		    debug(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
		      CANDLE_KEY1D, new Date(c.mts).toLocaleTimeString(),
		      c.open, c.high, c.low, c.close, c.volume,
		      // console.log(candles)
		    )
	    	prevTS = candles[0].mts
		}
	return callback(pair, candles); 
	})
}

BfxTrade.prototype.trade = function(pair, pairs, callback){
var min = 0;
switch (pair) {
	case 'ETHBTC':
		min = 0.02
		break;
	case 'BTCUSD':
		min = 0.002
		break;
	case 'IOTBTC':
		min = 10
		break;
	case 'NEOBTC':
		min =  0.2
		break;
	}
	console.log('Inside bfx trade with: ', pair, '- Sell price: ', pairs[pair]['lastPrice'], '- Amount: ', pairs[pair]['sellAmount']);
	'use strict'
	process.env.DEBUG = 'bfx:examples:*'

	const debug = require('debug')('bfx:examples:ws2_orders')
	const { Order } = require('././lib/models')
	const bfx = require('./bfx')
	const ws = bfx.ws(2)

	ws.on('error', (err) => {
	  console.log(err)
	})
	ws.on('open', () => {
	  console.log('Opening websocket to trade')
	  ws.auth()
	})
	ws.once('auth', () => {
	  console.log('Trade authenticated')
	  // Build new order
	  const o = new Order({
	    cid: Date.now(),
	    symbol: 't'+pair,
	    price: pairs[pair]['sellPrice'],
	    amount: pairs[pair]['sellAmount']* min, //minimumum amount for IOTBTC is 10,
	    type: Order.type.EXCHANGE_MARKET
	}, ws)

	let closed = false

	  // Enable automatic updates
	o.registerListeners()

	o.on('update', () => {
		debug('order updated: %j', o.serialize())
	})

	o.on('close', () => {
		debug('order closed: %s', o.status)
		closed = true
	})

	debug('submitting order %d', o.cid)

	o.submit().then(() => {
		debug('got submit confirmation for order %d [%d]', o.cid, o.id)
	    // wait a bit...
	    setTimeout(() => {
	    	if (closed) return
			debug('canceling...')

	    	o.cancel().then(() => {
		        debug('got cancel confirmation for order %d', o.cid)
		        ws.close()
	      	}).catch((err) => {
		    	debug('error cancelling order: %j', err)
		        ws.close()
		    })
	    }, 2000)
	}).catch((err) => {
	    console.log(err)
	    ws.close()
		})
 // ws.close()
	})
ws.open()
}

function checkOrder(self, pair, orderId, action, callback){
	process.env.DEBUG = 'bfx:examples:*'

	const debug = require('debug')('bfx:examples:ws2_auth')
	const bfx = require('./bfx')
	const ws = bfx.ws(2)

	ws.on('open', () => { // wait for socket open
		ws.auth()           // & authenticate
		console.log('open')
	})

	ws.on('error', (err) => {
		console.log('error: %j', err)
		console.log('')
	})

	ws.once('auth', () => {
		console.log('authenticated')

	  // do somIOTing with authenticated ws stream
	})

	// Register a callback for any order snapshot that comes in (account orders)
	ws.onOrderSnapshot({}, (orders) => {
		console.log(`order snapshot: ${JSON.stringify(orders, null, 2)}`)
	})

	// Open the websocket connection
	// ws.open()
	}

	function cancelOrder(pair, orderId, callback){
		rest.cancel_order(orderId, function(err, data){
			if(!err){
				console.log(pair, 'Order has been cancelled', orderId);
				return callback();
			}else {
				console.log(pair, 'error occured when cancelling order', orderId);
				console.log(err.toString());
				setTimeout(function(){
					cancelOrder(pair, orderId, callback)
				}, 1000);
			}
		})
}

ws.open()
module.exports = BfxTrade;
