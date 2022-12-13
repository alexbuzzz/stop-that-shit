require('dotenv').config()
const Binance = require('node-binance-api')

const binance = new Binance().options({
  APIKEY: process.env.PUBLIC_API,
  APISECRET: process.env.SECRET_API,
})

let positions = {}
let orders = []

// Get positions
const getPos = async () => {
  const positionsData = await binance.futuresPositionRisk()
  let msg = ''

  positionsData.forEach((element) => {
    if (element.positionAmt != 0) {
      positions[element.symbol] = {
        ticker: element.symbol,
        amount: element.positionAmt,
      }

      msg += `${element.symbol} ${Number(element.unRealizedProfit).toFixed(
        2
      )}$\n`
    }
  })

  return { positions, msg }
}

// Close positions
const closePos = async () => {
  for (element in positions) {
    const ticker = positions[element].ticker
    const amount = positions[element].amount

    if (amount > 0) {
      await binance.futuresMarketSell(ticker, Math.abs(amount))
    }
    if (amount < 0) {
      await binance.futuresMarketBuy(ticker, Math.abs(amount))
    }
  }
  positions = {}
}

// Get orders
const getOrd = async () => {
  const ordersObj = await binance.futuresOpenOrders()
  let msg = ''

  ordersObj.forEach((element) => {
    orders.push(element.symbol)

    msg += `${element.symbol} ${element.price}\n`
  })

  return { orders, msg }
}

// Cancel orders
const cancelOrd = async () => {
  await orders.forEach(async (element) => {
    await binance.futuresCancelAll(element)
  })
  orders = []
}

// Set leverage
const setLeverage = async (lever) => {
  const futurePairs = await binance.futuresMarkPrice()
  const allTickers = []

  await futurePairs.forEach((element) => {
    allTickers.push(element.symbol)
  })

  if (lever == 'max') {
    const brackets = await binance.futuresLeverageBracket()

    brackets.forEach(async (element) => {
      await binance.futuresLeverage(
        element.symbol,
        element.brackets[0].initialLeverage
      )
    })
  } else {
    allTickers.forEach(async (element) => {
      await binance.futuresLeverage(element, lever)
    })
  }
}

module.exports = { getPos, closePos, getOrd, cancelOrd, setLeverage }
