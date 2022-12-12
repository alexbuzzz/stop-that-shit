require('dotenv').config()
const {
  checkOrdersAndPositions,
  removeOrders,
  closePositions,
  backKeyboard,
} = require('./keyboards')

const { getPos, closePos, getOrd, cancelOrd } = require('./binance')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

let delayTime

// START
try {
  bot.command('start', async (ctx) => {
    if (ctx.message.chat.id == process.env.USER_ID) {
      await ctx.reply('STOP THAT SHIT!!!')
      await ctx.replyWithAnimation({
        source: 'simpson-homer-simpson.mp4',
      })
      ctx.reply('Press button to check information:', checkOrdersAndPositions)
    }
  })
} catch (error) {
  console.log('start error' + error)
}

// CHECK ORDERS
try {
  bot.action('check_orders', async (ctx) => {
    clearTimeout(delayTime)
    const orders = await getOrd()

    if (orders.orders.length > 0) {
      ctx.editMessageText(`Orders:\n${orders.msg}`, removeOrders)
    } else {
      ctx.editMessageText('No open ORDERS yet 👌', backKeyboard)
    }
  })
} catch (error) {
  console.log('check_orders error' + error)
}

// CHECK POSITIONS
try {
  bot.action('check_positions', async (ctx) => {
    clearTimeout(delayTime)
    const positions = await getPos()

    if (Object.keys(positions.positions).length > 0) {
      ctx.editMessageText(`Positions:\n${positions.msg}`, closePositions)
    } else {
      ctx.editMessageText('No open POSITIONS yet 👌', backKeyboard)
    }
  })
} catch (error) {
  console.log('check_positions error' + error)
}

// CANCEL ORDERS
try {
  bot.action('remove_orders', async (ctx) => {
    await cancelOrd()
    ctx.editMessageText('✅ All orders were canceled', backKeyboard)
  })
} catch (error) {
  console.log('remove_orders error') + error
}

// CLOSE POSITIONS
try {
  bot.action('close_positions', async (ctx) => {
    await closePos()
    ctx.editMessageText('✅ All positions are closed', backKeyboard)
  })
} catch (error) {
  console.log('close_positions error' + error)
}

// BACK
try {
  bot.action('back', (ctx) => {
    ctx.editMessageText(
      'Press button to check information:',
      checkOrdersAndPositions
    )
  })
} catch (error) {
  console.log('back error' + error)
}

bot.launch()
