import { errorLog, event } from 'utils'
import { secondaryGuild } from 'src/index'
import { ContainerBuilder, SectionBuilder, TextChannel, TextDisplayBuilder, ThumbnailBuilder } from 'discord.js'

function accountAge(createdTimestamp: number): string {
    const created = new Date(createdTimestamp)
    const now = new Date()

    let years = now.getFullYear() - created.getFullYear()
    let months = now.getMonth() - created.getMonth()
    let days = now.getDate() - created.getDate()

    if (days < 0) {
        months--
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += previousMonth.getDate()
    }

    if (months < 0) {
        years--
        months += 12
    }

    return `${years} years, ${months} months, ${days} days`
}

export default event('guildMemberRemove', async ({}, Member) => {
    try {
        if (Member.user.bot) return
        if (Member.partial) return

        const channel = (await secondaryGuild.channels.fetch(process.env.JOIN_LEAVE_CHANNEL)) as TextChannel

        const container = new ContainerBuilder().addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        [
                            `# ${Member.user.displayName} `,
                            '### Member Joined',
                            `Account created ${accountAge(Member.user.createdTimestamp)}`,
                            `-# ${Member.user.id}`,
                        ].join('\n')
                    )
                )
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(Member.user.defaultAvatarURL))
        )

        channel.send({ components: [container], flags: 'IsComponentsV2' })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
