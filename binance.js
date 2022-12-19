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

// Get balances
const getBalances = async () => {
  let msg = 'FUT:\n'

  const fut = await binance.futuresBalance()

  await fut.forEach((element) => {
    if (element.balance > 0) {
      msg += `${element.asset} ${Number(element.balance).toFixed(2)}$\n`
    }
  })

  const spot = await binance.balance()

  msg += '\nSPOT:\n'

  Object.keys(spot).forEach((key) => {
    if (spot[key].available > 0) {
      msg += `${key} ${Number(spot[key].available).toFixed(2)}$\n`
    }
  })

  return msg
}

// Get fundings
const getFundingRate = async () => {
  let msg = ''
  const res = await binance.futuresMarkPrice()
  const currentTime = res[1].time
  const nextTime = res[1].nextFundingTime
  const minsLeft = Math.round((nextTime - currentTime) / 1000 / 60)
  let h = Math.floor(minsLeft / 60)
  let m = minsLeft % 60

  msg += `Time to next funding: ${(h = h < 10 ? '0' + h : h)}:${(m =
    m < 10 ? '0' + m : m)}\n\n`

  await res.forEach((element) => {
    const rate = (element.lastFundingRate * 100).toFixed(2)

    if (Math.abs(rate) > 1) {
      msg += `${element.symbol} ${rate}\n`
    }
  })
  return msg
}

module.exports = {
  getPos,
  closePos,
  getOrd,
  cancelOrd,
  setLeverage,
  getBalances,
  getFundingRate,
}
