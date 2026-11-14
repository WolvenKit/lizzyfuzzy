import { errorLog, event } from 'utils'
import { db } from 'src/index'

interface result {
    text: string
    keywords: string
}

export default event('messageCreate', async ({ client }, Message) => {
    try {
        if (Message.author.bot || !Message.channel.isSendable() || !Message.channel.isTextBased()) return

        if (!Message.mentions.has(client.user!)) return

        const words = Message.content.trim().split(/\s+/)

        const result = db.query('SELECT text, keywords FROM speech WHERE type = "mention"').all() as result[]

        result.forEach((i) => {
            const keywords = i.keywords.trim().split(/\s+/)
            const found = words.filter((item) => keywords.includes(item))

            if (!found.length) return

            Message.reply({
                content: i.text,
            })
        })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
