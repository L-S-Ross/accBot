'use strict'

require('dotenv').config()

const BFX = require('bitfinex-api-node')
const SocksProxyAgent = require('socks-proxy-agent')


const { API_KEY = 'Get from Bitfinex account', 
API_SECRET = 'Get from Bitfinex account', 
REST_URL = 'https://api.bitfinex.com/v2', 
WS_URL = 'wss://api.bitfinex.com/ws/2', 
SOCKS_PROXY_URL } = process.env
const agent = SOCKS_PROXY_URL ? new SocksProxyAgent(SOCKS_PROXY_URL) : null

const bfx = new BFX({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
    transform: true,

  ws: {
    url: WS_URL,
    agent
  },

  rest: {
    url: REST_URL,
    agent
  }
})

module.exports = bfx
