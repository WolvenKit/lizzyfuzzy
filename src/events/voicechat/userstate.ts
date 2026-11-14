import { errorLog, event, log } from 'utils'
import { db } from 'src/index'

export default event('voiceStateUpdate', async ({ client }, oldState, newState) => {
    try {
        const member = newState.member || oldState.member

        if (!member) return

        if (!oldState.channelId && newState.channelId) {
            const timestamp = new Date(Date.now()).getTime().toString()

            db.prepare(`INSERT INTO vcuserstate (userid, channelid, jointime) VALUES ($userid, $channelid, $jointime)`).run({
                userid: member.id,
                channelid: newState.channelId,
                jointime: timestamp,
            })
        } else if (oldState.channelId && !newState.channelId) {
            db.prepare(`DELETE FROM vcuserstate WHERE userid = ${member.id}`).run()
        } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            const timestamp = new Date(Date.now()).getTime().toString()

            db.prepare(`UPDATE vcuserstate SET channelid = ${newState.channelId}, jointime = ${timestamp} WHERE userid = ${member.id}`).run()
        }
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
