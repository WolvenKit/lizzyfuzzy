import { errorLog, event, log } from 'utils'
import { db } from 'src/index'

export default event('voiceStateUpdate', async ({ client }, oldState, newState) => {
    try {
        const member = newState.member || oldState.member

        if (!member) return

        if (oldState.channelId && !newState.channelId) {
            const voiceChat = oldState.channel
            if (!voiceChat) return
            if (oldState.channel.members.size > 0) return
            if (!oldState.channel.deletable) return

            oldState.channel.delete()
            db.prepare(`DELETE FROM voicechannel WHERE channelid = ${oldState.channelId}`).run()
        } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            const voiceChat = oldState.channel
            if (!voiceChat) return
            if (oldState.channel.members.size > 0) return
            if (!oldState.channel.deletable) return

            oldState.channel.delete()
            db.prepare(`DELETE FROM voicechannel WHERE channelid = ${oldState.channelId}`).run()
        }
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
