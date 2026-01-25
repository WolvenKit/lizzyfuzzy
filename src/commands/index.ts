//
// CONTEXT COMMANDS
//

import who from './context/who'
import emoji from './context/emoji'
import avatar from './context/avatar'

//
// SLASH COMMANDS
//

import link from './slash/link'
import clear from './slash/clear'
import createquotes from './slash/createQuote'
import quotes from './slash/quotes'
import admin from './slash/admin'
// import stats from './slash/stats'

export default [who, link, clear, quotes, createquotes, avatar, emoji, admin]
