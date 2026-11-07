import { errorLog, event } from 'utils'
import { db } from 'src/index'

interface result {
    text: string
    keywords: string
}

export default event('messageCreate', async ({ client }, Message) => {
    try {
        if (Message.author.bot || !Message.channel.isSendable() || !Message.channel.isTextBased()) return

        const words = Message.content.trim().split(/\s+/)

        const result = db.query('SELECT text, keywords FROM speech WHERE type = "random"').all() as result[]

        const matching = result.filter((i) => {
            const keywords = i.keywords.trim().toLowerCase().split(/\s+/)
            return words.some((word) => keywords.includes(word))
        })
        if (!matching.length) return

        const randomness = Math.random() > 0.1

        if (randomness) return

        const response = matching[Math.floor(Math.random() * matching.length)]

        await Message.reply({
            content: response.text,
        })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
