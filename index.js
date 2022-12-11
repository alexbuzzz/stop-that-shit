require('dotenv').config()
const {
  checkOrdersAndPositions,
  removeOrders,
  closePositions,
} = require('./keyboards')

const { getPositions } = require('./binance')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

let delayTime

// START
bot.command('start', async (ctx) => {
  await ctx.replyWithPhoto({ source: 'homer_jay_simpson_agadiwmaakcvaak.png' })
  ctx.reply('Press button to check information:', checkOrdersAndPositions)
})

// CHECK ORDERS
bot.action('check_orders', async (ctx) => {
  clearTimeout(delayTime)
  ctx.editMessageText('Orders', removeOrders)
})

// CHECK POSITIONS
bot.action('check_positions', async (ctx) => {
  clearTimeout(delayTime)
  const positions = await getPositions()

  if (Object.keys(positions).length > 0) {
    ctx.editMessageText(`Positions: \n ${positions}`, closePositions)
  } else {
    ctx.editMessageText('No open POSITIONS yet 👌', checkOrdersAndPositions)
    changeTextBack(ctx, 4000)
  }
})

// REMOVE ORDERS
bot.action('remove_orders', (ctx) => {
  ctx.editMessageText('✅ All orders removed', checkOrdersAndPositions)
  changeTextBack(ctx, 4000)
})

// CLOSE POSITIONS
bot.action('close_positions', (ctx) => {
  ctx.editMessageText('✅ All positions are closed', checkOrdersAndPositions)
  changeTextBack(ctx, 4000)
})

// BACK
bot.action('back', (ctx) => {
  ctx.editMessageText(
    'Press button to check information:',
    checkOrdersAndPositions
  )
})

// Change text back
const changeTextBack = (ctx, delay) => {
  delayTime = setTimeout(() => {
    ctx.editMessageText(
      'Press button to check information:',
      checkOrdersAndPositions
    )
  }, delay)
}

bot.launch()
