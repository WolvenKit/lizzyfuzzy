import { MessageFlags, SlashCommandBuilder } from 'discord.js'
import { command, db } from 'utils'

const meta = new SlashCommandBuilder().setName('quote').setDescription('quotes')

interface quote {
    id: number
    quote: string
    responde: string
    server: string
}

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return
    if (!interaction.guild) return
    if (interaction.user.bot) return

    await db`
       SELECT * FROM quotes WHERE server = ${interaction.guild.id} AND responde = ${interaction.user.id} OR responde = 'everyone' ORDER BY RANDOM() LIMIT 1;
    `.then((res: quote[]) => {
        if (res.length === 0) {
            return interaction.reply({
                content: 'No quotes found for this server.',
                flags: MessageFlags.Ephemeral,
            })
        }

        const randomIndex = Math.floor(Math.random() * res.length)
        const randomQuote = res[randomIndex]

        return interaction.reply({
            content: randomQuote.quote,
        })
    })
})
