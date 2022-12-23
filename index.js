const cron = require('node-cron')

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
  getFundingRate,
} = require('./binance')

const { helpText } = require('./textTemplates')

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

let delayTime

// START

bot.command('start', async (ctx) => {
  if (ctx.message.chat.id == process.env.USER_ID) {
    try {
      await ctx.replyWithPhoto({ source: './lazyscalp1000x1000.png' })
      ctx.reply('Press button to do something:', startKeyboard)
    } catch (error) {
      console.log('start error' + error)
    }

    // cron.schedule('* * * * *', async () => {
    //   const msg = await ctx.reply(
    //     'Hi there! 👋 \nGo chill and wait for a signal from me! 😎'
    //   )
    //   console.log(msg.message_id)
    // })
  }
})

// CHECK ORDERS
try {
  bot.action('check_orders', async (ctx) => {
    clearTimeout(delayTime)
    const orders = await getOrd()

    if (orders.status === 'empty') {
      ctx.editMessageText('No open ORDERS yet 👌', backKeyboard)
    } else if (orders.status === 'error') {
      ctx.editMessageText(orders.msg, backKeyboard)
    } else {
      ctx.editMessageText(`Orders:\n${orders.msg}`, removeOrders)
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

    if (positions.status === 'empty') {
      ctx.editMessageText('No open POSITIONS yet 👌', backKeyboard)
    } else if (positions.status === 'error') {
      ctx.editMessageText(positions.msg, backKeyboard)
    } else {
      ctx.editMessageText(`Positions:\n${positions.msg}`, closePositions)
    }
  })
} catch (error) {
  console.log('check_positions error' + error)
}

// CANCEL ORDERS
try {
  bot.action('remove_orders', async (ctx) => {
    const cancelStatus = await cancelOrd()
    ctx.editMessageText(cancelStatus, backKeyboard)
  })
} catch (error) {
  console.log('remove_orders error') + error
}

// CLOSE POSITIONS
try {
  bot.action('close_positions', async (ctx) => {
    const closeStatus = await closePos()
    ctx.editMessageText(closeStatus, backKeyboard)
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
    const res = await setLeverage(1)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('one error' + error)
}

// SET 2
try {
  bot.action('two', async (ctx) => {
    const res = await setLeverage(2)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('two error' + error)
}

// SET 5
try {
  bot.action('five', async (ctx) => {
    const res = await setLeverage(5)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('five error' + error)
}

// SET 8
try {
  bot.action('eight', async (ctx) => {
    const res = await setLeverage(8)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('eight error' + error)
}

// SET 10
try {
  bot.action('ten', async (ctx) => {
    const res = await setLeverage(10)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('ten error' + error)
}

// SET 20
try {
  bot.action('twenty', async (ctx) => {
    const res = await setLeverage(20)
    ctx.editMessageText(res, backKeyboard)
  })
} catch (error) {
  console.log('twenty error' + error)
}

// SET MAX
try {
  bot.action('max', async (ctx) => {
    const res = await setLeverage('max')
    ctx.editMessageText(res, backKeyboard)
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

// FUNDINGS
try {
  bot.action('fundings', async (ctx) => {
    const fundings = await getFundingRate()
    ctx.editMessageText(fundings, backKeyboard)
  })
} catch (error) {
  console.log('back error' + error)
}

// HELP
try {
  bot.action('help', async (ctx) => {
    ctx.editMessageText(helpText, backKeyboard)
  })
} catch (error) {
  console.log('back error' + error)
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
