require('dotenv').config()
const Binance = require('node-binance-api')

const binance = new Binance().options({
  APIKEY: process.env.PUBLIC_API,
  APISECRET: process.env.SECRET_API,
})

const positions = {}

// Ges positions
const getPositions = async () => {
  const positionsData = await binance.futuresPositionRisk()

  positionsData.forEach((element) => {
    if (element.positionAmt != 0) {
      positions[element.symbol] = {
        ticker: element.symbol,
        amount: element.positionAmt,
        dollarAmount: Number(element.positionAmt * element.markPrice).toFixed(
          2
        ),
        profit: Number(element.unRealizedProfit).toFixed(2),
      }
    }
  })

  return positions
}

// Close positions
const closePositions = async () => {
  positions.forEach((element) => {
    console.log(element)
  })
}

module.exports = { getPositions, closePositions }
