import Database from 'bun:sqlite'
import { log } from 'src/utils'
import { Experience } from 'src/types/database'

const db = new Database('./database/database.sqlite')

export function inputSpeech(keywords: string, text: string, type: string) {
    db.prepare(`INSERT INTO speech (keywords, text, type) VALUES ($keywords, $text, $type)`).run({
        keywords: keywords,
        text: text,
        type: type,
    })
    return
}

export function registerVoiceChatController(guildid: string, messageid: string, minrole: string | null = null, modrole: string, categoryid: string) {
    const guild = db.query(`SELECT guildid FROM voicechatcontroller WHERE guildid = ${guildid}`).get()

    console.log(guild)

    if (guild) return

    console.log('register', guildid, messageid, minrole, categoryid, modrole)

    console.log(db.prepare(`SELECT * FROM voicechatcontroller`).all())

    const insert = db
        .prepare(
            `INSERT INTO voicechatcontroller (guildid, messageid, minrole, moderatorrole, categoryid) VALUES ($guildid, $messageid, $minrole, $modrole, $categoryid)`
        )
        .run({
            guildid: guildid,
            messageid: messageid,
            minrole: minrole,
            categoryid: categoryid,
            modrole: modrole,
        })

    console.log(db.prepare(`SELECT * FROM voicechatcontroller`).all())

    if (insert.changes == 1) {
        log(`Succesfully insert new Controller.`)
        return insert
    }
    return insert
}

export function LeaderboardQuerry(guildid: string) {
    const date = db
        .query(
            `SELECT *
    FROM (
        SELECT
            discordid,
            level,
            experience,
            messagecount,
            RANK() OVER (
                ORDER BY level DESC, experience DESC
            ) AS rank
        FROM experience
        WHERE guildid = ${guildid}
    )
    ORDER BY rank
    LIMIT 10`
        )
        .all() as Experience[]

    return date
}
