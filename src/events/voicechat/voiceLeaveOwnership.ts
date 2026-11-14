import { errorLog, event, log } from 'utils'
import { db } from 'src/index'
import type { VoiceChannelType, VoiceChannelControler } from 'src/types/voiceChannel'

export default event('channelUpdate', async ({ client }, Channel) => {
    try {
        if (!Channel.isVoiceBased()) return
        const vcController = db.query(`SELECT * FROM voicechatcontroller WHERE guildid = ${Channel.guildId}`).get() as VoiceChannelControler
        if (Channel.parentId != vcController.categoryid) return

        const vcChannel = db.query(`SELECT * FROM voicechannel WHERE channelid = ${Channel.id}`).get() as VoiceChannelType
        const members = Channel.members

        members.map((member) => {})
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
