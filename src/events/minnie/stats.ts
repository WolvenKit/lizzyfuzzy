import { errorLog, event, db } from 'utils'
import Dictionary from 'en-dictionary'

const wordnet = require('en-wordnet').default

export default event('messageCreate', async ({ client }, Message) => {
    if (Message.author.bot) return

    let dictionary = new Dictionary(wordnet.get('3.0'))
    await dictionary.init()

    const Search = dictionary.searchSimpleFor(['entrepreneur'])

    console.log(Search.get('entrepreneur'))
})
