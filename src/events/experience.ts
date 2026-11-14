import { errorLog, event } from 'utils'
import { calculateXP } from 'src/scripts/level'
import { db } from 'src/index'
import { log } from 'utils'

interface XPCalculation {
    xp: number
    words: number
    attachments: number
}
interface Level {
    level: number
}

async function getUserLevel(userId: string, guildId: string): Promise<Level> {
    const findUser = db.query(`select id from experience where discordid = ${userId} and guildid = ${guildId}`).get()

    if (!findUser) {
        db.prepare(`insert into experience (discordid, guildid) values (${userId}, ${guildId})`).run()
        return {
            level: 1,
        }
    }

    const result = db.query(`select level from experience where discordid = ${userId} and guildid = ${guildId}`).get() as Level
    return result
}

async function setData(userId: string, guildId: string, result: XPCalculation): Promise<void> {
    db.prepare(
        `UPDATE experience SET experience = experience + ${result.xp}, messagecount = messagecount + 1 WHERE discordid = ${userId} AND guildid = ${guildId}`
    ).run()
}

async function getData(userId: string, guildId: string) {
    const data = db.query(`select * from experience where discordid = ${userId} AND guildid = ${guildId}`).get()
}

async function calcLevel(userId: string, guildId: string, result: XPCalculation) {
    const xp = db.query(`select experience, level from experience where discordid = ${userId} AND guildid = ${guildId}`).get() as {
        experience: number
        level: number
    }

    let totalXP = xp.experience
    let level = xp.level

    while (totalXP >= (level + 1) * process.env.XP_COEFFICIANT) {
        totalXP -= (level + 1) * process.env.XP_COEFFICIANT
        level++
    }

    db.prepare(`update experience set level = ${level} where discordid = ${userId} AND guildid = ${guildId}`).run()

    return {
        level,
    }
}

export default event('messageCreate', async ({ client }, Message) => {
    try {
        // Ignore bots and DMs
        if (!Message.guild || Message.author.bot) return
        // if (Message.guild.id == process.env.SUPPORT_GUILD) return

        const level = await getUserLevel(Message.author.id, Message.guild.id)

        const result = calculateXP(Message, level)

        if (result.xp <= 0) return

        const newLevel = await calcLevel(Message.author.id, Message.guild.id, result)

        await setData(Message.author.id, Message.guild.id, result)

        await getData(Message.author.id, Message.guild.id)

        log(
            `${Message.author.tag} (${Message.author.id}) earned ${result.xp} XP ` +
                `(${result.words} words, ` +
                `${result.attachments} attachments), ` +
                `${newLevel.level} level`
        )
    } catch (e) {
        errorLog('experience ' + e)
    }
})
