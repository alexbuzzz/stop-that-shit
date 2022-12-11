const { Markup } = require('telegraf')

// Status button
const checkOrdersAndPositions = Markup.inlineKeyboard([
  Markup.button.callback('🔄 ORDERS', 'check_orders'),
  Markup.button.callback('🔄 POSITIONS', 'check_positions'),
])

// Remove orders
const removeOrders = Markup.inlineKeyboard([
  [Markup.button.callback('❌ TAKE OFF ORDERS', 'remove_orders')],
  [Markup.button.callback('⬅️ BACK', 'back')],
])

// Close positions
const closePositions = Markup.inlineKeyboard([
  [Markup.button.callback('❌ CLOSE POSITIONS', 'close_positions')],
  [Markup.button.callback('⬅️ BACK', 'back')],
])

module.exports = {
  checkOrdersAndPositions,
  removeOrders,
  closePositions,
}
