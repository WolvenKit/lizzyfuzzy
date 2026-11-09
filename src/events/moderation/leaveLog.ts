import { errorLog, event } from 'utils'
import { secondaryGuild } from 'src/index'
import { ContainerBuilder, SectionBuilder, TextChannel, TextDisplayBuilder, ThumbnailBuilder } from 'discord.js'

export default event('guildMemberRemove', async ({}, Member) => {
    try {
        if (Member.user.bot) return
        if (Member.partial) return

        const channel = (await secondaryGuild.channels.fetch(process.env.JOIN_LEAVE_CHANNEL)) as TextChannel

        const container = new ContainerBuilder().addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent([`# ${Member.user.displayName} `, '### Member Left', `-# ${Member.user.id}`].join('\n'))
                )
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(Member.user.defaultAvatarURL))
        )

        channel.send({ components: [container], flags: 'IsComponentsV2' })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
