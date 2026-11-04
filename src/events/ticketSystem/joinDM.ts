import { errorLog, event } from 'utils'

export default event('guildMemberAdd', async ({ client }, User) => {
    try {
        if (User.guild.id == '717692382849663036') return

        User.send({
            content:
                'If you want to start a Ticket, send me a message and we get the ticket started! Any ticket about modding support will get closed without warning and can get you banned from the system.',
        })
    } catch (e) {
        errorLog('joinDM ' + e)
    }
})
