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
import tag from './slash/tag'
import createquotes from './slash/createQuote'
import quotes from './slash/quotes'
import core from './slash/core'
import admin from './slash/admin'

export default [
    who,
    link,
    clear,
    core,
    quotes,
    createquotes,
    avatar,
    emoji,
    tag,
    admin,
]
