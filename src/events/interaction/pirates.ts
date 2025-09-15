import { MessageFlags } from 'discord.js'
import { errorLog, event, settingsDB } from 'utils'

export default event('interactionCreate', async ({ client }, interaction) => {
    const collector = interaction.create

    try {
        if (!interaction.isButton()) return
        const inter = interaction.message

        const id = interaction.customId.split('_')[2]
        const name = interaction.customId.split('_').slice(0, -1).join('_')
        const user = await interaction.guild?.members.fetch(id as string)
        const role = await interaction.guild?.roles.fetch(process.env.settingMarkedMemberRole)

        if (name === 'pirate_mark') {
            user?.roles.add(role)

            interaction.reply({
                content: 'Member marked',
                flags: MessageFlags.Ephemeral,
            })

            inter.edit({
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 4,
                                label: 'Mark',
                                custom_id: `pirate_mark_${id}`,
                                disabled: true,
                            },
                            {
                                type: 2,
                                style: 2,
                                label: 'Ignore',
                                custom_id: `pirate_ignore_${id}`,
                                disabled: true,
                            },
                        ],
                    },
                ],
            })
        } else if (name === 'pirate_ignore') {
            settingsDB.query(`DELETE FROM markedMembers WHERE user = '${id}'`).run()

            inter.edit({
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 4,
                                label: 'Mark',
                                custom_id: `pirate_mark_${id}`,
                                disabled: true,
                            },
                            {
                                type: 2,
                                style: 2,
                                label: 'Ignore',
                                custom_id: `pirate_ignore_${id}`,
                                disabled: true,
                            },
                        ],
                    },
                ],
            })

            return interaction.reply({
                content: 'Ignored marked member',
                flags: MessageFlags.Ephemeral,
            })
        }
    } catch (e) {
        errorLog(e)
    }
})
