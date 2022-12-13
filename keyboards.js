const { Markup } = require('telegraf')

// Status button
const checkOrdersAndPositions = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 ORDERS', 'check_orders'),
    Markup.button.callback('🔄 POSITIONS', 'check_positions'),
  ],
  [
    Markup.button.callback('⚙️ LEVERAGE', 'leverage'),
    Markup.button.callback('💰 WALLET', 'wallet'),
  ],
])

// Remove orders
const removeOrders = Markup.inlineKeyboard([
  [Markup.button.callback('❌ TAKE OFF ALL ORDERS', 'remove_orders')],
  [Markup.button.callback('⬅️ BACK', 'back')],
])

// Close positions
const closePositions = Markup.inlineKeyboard([
  [Markup.button.callback('❌ CLOSE ALL POSITIONS', 'close_positions')],
  [Markup.button.callback('⬅️ BACK', 'back')],
])

// Choose leverage
const chooseLeverage = Markup.inlineKeyboard([
  [
    Markup.button.callback('1x', 'one'),
    Markup.button.callback('2x', 'two'),
    Markup.button.callback('5x', 'five'),
  ],
  [
    Markup.button.callback('8x', 'eight'),
    Markup.button.callback('10x', 'ten'),
    Markup.button.callback('20x', 'twenty'),
  ],
  [
    Markup.button.callback('⬅️ BACK', 'back'),
    Markup.button.callback('MAX', 'max'),
  ],
])

// Back
const backKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('⬅️ BACK', 'back'),
])

module.exports = {
  checkOrdersAndPositions,
  removeOrders,
  closePositions,
  backKeyboard,
  chooseLeverage,
}
