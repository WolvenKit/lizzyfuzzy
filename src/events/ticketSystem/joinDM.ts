import { errorLog, event } from 'utils'

export default event('guildMemberAdd', async ({ client }, User) => {
    try {
        User.send({
            content: 'If you want to start a Ticket, send me a message and we get the ticket started!',
        })
    } catch (e) {
        errorLog(e)
    }
})
