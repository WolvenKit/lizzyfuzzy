import { errorLog, event, log } from 'utils'
import { db } from 'src/index'
import { VoiceChannelControler } from 'src/types/voiceChannel'

export default event('messageDelete', async ({}, Message) => {
    try {
        const controller = db.query(`SELECT * FROM voicechatcontroller WHERE messageid = ${Message.id}`).get() as VoiceChannelControler
        if (!controller) return
        if (Message.id != controller.messageid) return

        const del = db.prepare(`DELETE FROM voicechatcontroller WHERE messageid = ${Message.id}`).run()

        if (del.changes == 0) {
            errorLog('Couldnt delete ' + Message.id + ' from the controler database')
        }

        log('Deleted ' + Message.id + 'from the controller database. ')
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
