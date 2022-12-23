// // Get fundings
// const getFundingRate = async () => {
//   let count = 0
//   let msg = ''
//   const res = await binance.futuresMarkPrice()
//   const currentTime = res[1].time
//   const nextTime = res[1].nextFundingTime
//   const minsLeft = Math.round((nextTime - currentTime) / 1000 / 60)
//   let h = Math.floor(minsLeft / 60)
//   let m = minsLeft % 60

//   msg += `⏱ NEXT FUNDING IN: ${(h = h < 10 ? '0' + h : h)}:${(m =
//     m < 10 ? '0' + m : m)}\n\n`

//   await res.forEach((element) => {
//     const rate = (element.lastFundingRate * 100).toFixed(2)

//     if (Math.abs(rate) > 1) {
//       msg += `${element.symbol} ${rate}\n`
//       count++
//     }
//   })
//   return { msg, count }
// }

// FUNDINGS
try {
  bot.action('fundings', async (ctx) => {
    const fundings = await (await getFundingRate()).msg
    ctx.editMessageText(fundings, backKeyboard)
  })
} catch (error) {
  console.log('back error' + error)
}

// START
try {
  bot.command('start', async (ctx) => {
    if (ctx.message.chat.id == process.env.USER_ID) {
      ctx.reply('Press button to do something:', startKeyboard)

      // 58 */8 * * *
      cron.schedule('* * * * *', async () => {
        if ((await (await getFundingRate()).count) > 0) {
          const msg = await ctx.reply('❗️ FUNDING IN 2 MINUTES')

          setTimeout(() => {
            ctx.deleteMessage(msg.message_id)
          }, 5000)
        }
      })
    }
  })
} catch (error) {
  console.log('start error' + error)
}
