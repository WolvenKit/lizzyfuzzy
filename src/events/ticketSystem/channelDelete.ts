import { errorLog, event } from 'utils'
import { db } from 'src/index'

export default event('channelDelete', async ({ client }, Interaction) => {
    try {
        const channel = Interaction.id
        db.prepare(`DELETE FROM channels WHERE channelid = ${channel}`).run()
    } catch (e) {
        errorLog('channelDelete ' + e)
    }
})
