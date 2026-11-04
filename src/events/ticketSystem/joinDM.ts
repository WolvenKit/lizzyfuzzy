import { errorLog, event } from 'utils'

export default event('guildMemberAdd', async ({ client }, User) => {
    try {
        console.log(User.guild.id)
        const supportServer = client.guilds.cache.get(process.env.SUPPORT_GUILD) || (await client.guilds.fetch(process.env.SUPPORT_GUILD))
        const user = (await supportServer.members.fetch(User.id)) || null

        if (!user) return

        User.send({
            content:
                'If you want to start a Ticket, send me a message and we get the ticket started! Any ticket about modding support will get closed without warning and can get you banned from the system.',
        })
    } catch (e) {
        errorLog('joinDM ' + e)
    }
})
