import { errorLog, event, db } from 'utils'

export default event('messageCreate', async ({ client }, Message) => {
    try {
        if (Message.author.bot) return

        const userSearch =
            await db`SELECT * FROM wrappedwhitelist WHERE discordid = ${
                Message.author.id
            } AND wrapped = ${true};`

        if (userSearch.length === 0) return

        const wrappedEntry =
            await db`SELECT * FROM wrapped WHERE discordid = ${Message.author.id};`

        if (wrappedEntry.length === 0) {
            await db`INSERT INTO wrapped (discordid, messagessend) VALUES (${
                Message.author.id
            }, ${1});`
        } else {
            await db`UPDATE wrapped SET messages = messages + ${1} WHERE discordid = ${
                Message.author.id
            };`
        }
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
