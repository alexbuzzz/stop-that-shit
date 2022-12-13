require('dotenv').config()
const {
  startKeyboard,
  removeOrders,
  closePositions,
  backKeyboard,
  chooseLeverage,
} = require('./keyboards')

const {
  getPos,
  closePos,
  getOrd,
  cancelOrd,
  setLeverage,
  getBalances,
} = require('./binance')

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
      ctx.reply('Press button to do something:', startKeyboard)
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

// CHOOSE LEVERAGE
try {
  bot.action('leverage', async (ctx) => {
    ctx.editMessageText(
      'Select leverage value to set in all futures:',
      chooseLeverage
    )
  })
} catch (error) {
  console.log('leverage error' + error)
}

// SET 1
try {
  bot.action('one', async (ctx) => {
    await setLeverage(1)
    ctx.editMessageText('✅ 1X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('one error' + error)
}

// SET 2
try {
  bot.action('two', async (ctx) => {
    await setLeverage(2)
    ctx.editMessageText('✅ 2X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('two error' + error)
}

// SET 5
try {
  bot.action('five', async (ctx) => {
    await setLeverage(5)
    ctx.editMessageText('✅ 5X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('five error' + error)
}

// SET 8
try {
  bot.action('eight', async (ctx) => {
    await setLeverage(8)
    ctx.editMessageText('✅ 8X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('eight error' + error)
}

// SET 10
try {
  bot.action('ten', async (ctx) => {
    await setLeverage(10)
    ctx.editMessageText('✅ 10X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('ten error' + error)
}

// SET 20
try {
  bot.action('twenty', async (ctx) => {
    await setLeverage(20)
    ctx.editMessageText('✅ 20X successfully set', backKeyboard)
  })
} catch (error) {
  console.log('twenty error' + error)
}

// SET MAX
try {
  bot.action('max', async (ctx) => {
    await setLeverage('max')
    ctx.editMessageText('✅ MAX LEVERAGE successfully set!!!', backKeyboard)
  })
} catch (error) {
  console.log('max error' + error)
}

// BALANCES
try {
  bot.action('balances', async (ctx) => {
    const balances = await getBalances()
    ctx.editMessageText(balances, backKeyboard)
  })
} catch (error) {
  console.log('max error' + error)
}

// BACK
try {
  bot.action('back', (ctx) => {
    ctx.editMessageText('Press button to do something:', startKeyboard)
  })
} catch (error) {
  console.log('back error' + error)
}

bot.launch()
