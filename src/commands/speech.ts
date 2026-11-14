import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command } from 'utils'
import { inputSpeech } from 'src/scripts/interactionQuerries'

const meta = new SlashCommandBuilder()
    .setName('speech')
    .setDescription('speech')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((stringOption) => stringOption.setName('text').setDescription('The message').setRequired(true))
    .addStringOption((stringOption) => stringOption.setName('keywords').setDescription('Reaction Keywords, seperate by comma.').setRequired(true))
    .addStringOption((stringOption) =>
        stringOption.setName('type').setDescription('Reply Type').setRequired(true).addChoices(
            {
                name: 'Mention',
                value: 'mention',
            },
            {
                name: 'Random',
                value: 'random',
            }
        )
    )

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return
        if (!interaction.channel?.isTextBased) return

        const text = interaction.options.getString('text', true)
        const keywords = interaction.options.getString('keywords', true)
        const type = interaction.options.getString('type', true)

        console.log(keywords)

        const testKeywords = new RegExp(/^\s*[\w-]+(?:\s*,\s*[\w-]+)*\s*$/)
        const keywordTest = testKeywords.exec(keywords)

        if (!keywordTest) {
            console.log(keywordTest)

            await interaction.reply({
                content: 'Keywords has not been seperated by commas. Please only use commas and no other character',
                flags: 'Ephemeral',
            })
            return
        }

        inputSpeech(keywords, text, type)

        await interaction.reply({
            content:
                'Successfully made entry with the following options:\n\n**__Text__**: `' +
                text +
                ' `\n\n**__keywords__**: `' +
                keywords +
                '`\n\n**__type__**: `' +
                type +
                '`',
            flags: 'Ephemeral',
        })
    } catch (e) {
        console.log(e)
    }
})
