import { Database } from 'bun:sqlite'
import { errorLog, log } from './logging'
import fs from 'node:fs'

export const settingsDB = new Database('./src/database/settings.sqlite', {
    create: true,
})

export async function prepareStart() {
    try {
        const t1 = settingsDB
            .query(
                `SELECT name
    FROM sqlite_master
    WHERE type='table' AND name='settings';`
            )
            .get()

        if (!t1) {
            const run = settingsDB.run(fs.readFileSync('./src/resources/SQL/start.sql', 'utf-8'))
            if (run) {
                log('[PrepareStart] Tables Created')
            }
            // Check if the Tables already have data.
            const CheckCommands = settingsDB.query(`SELECT * FROM "commands"`).get()

            if (!CheckCommands && process.env.GET_COMMANDS === 'true') {
                // Get the current commands from the API Global.
                try {
                    const data = await fetch('http://localhost:3000/commands', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })

                    const CommandsData = await data.json()

                    // Insert the commands into the Database.
                    settingsDB.run(`INSERT INTO commands (initiator, textorjson, command) VALUES (?, ?, ?)`, [
                        CommandsData.initiator,
                        CommandsData.type,
                        CommandsData.command,
                    ])
                } catch (error) {
                    errorLog('[PrepareStart Error] [ FIRST INSERT ]' + error)
                }
            }

            if (process.env.GET_COMMANDS === 'false') {
                // If the GET_COMMANDS is disabled, we will not get the commands from the API.
                // Instead we will use the following env variables to populate the settings database.

                // before we insert the data, we need to check if the env are set.
                if (
                    !process.env.moderationCategory ||
                    !process.env.markedMembersChannel ||
                    !process.env.moderationLogChannel ||
                    !process.env.settingMarkedMemberRole
                ) {
                    errorLog('[PrepareStart Error] [ MISSING ENV VARIABLES ]')
                    settingsDB.close()
                    return
                }

                const check = settingsDB.query(`SELECT key FROM settings`).get()

                if (check) {
                    settingsDB.close()
                    return
                }

                const prepare = settingsDB.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`)
                const insertMany = settingsDB.transaction((settings) => {
                    for (const setting of settings) prepare.run(setting)
                })

                insertMany([
                    ['moderationCategory', process.env.moderationCategory],
                    ['markedMembersChannel', process.env.markedMembersChannel],
                    ['moderationLogChannel', process.env.moderationLogChannel],
                    ['settingMarkedMemberRole', process.env.settingMarkedMemberRole],
                ])

                settingsDB
                    .query(`SELECT * FROM settings`)
                    .all()
                    .forEach((row: any) => {
                        log(`[Settings] ${row.key} = ${row.value}`)
                    })
            }
            return
        }
    } catch (error) {
        errorLog('[PrepareStart Error] [ MAIN ]' + error)
    }
}

interface Settings {
    id: number
    key: string
    value: string
}

export async function updateSetting() {
    const existingSettings: Settings[] = await settingsDB.query(`SELECT * FROM settings`).all()

    if (!existingSettings) {
        log('[Settings] No existing settings found')
        return
    }

    const isUpdated = existingSettings.map((settings) => {
        return settings.value === process.env[settings.key]
    })

    if (!isUpdated.every((value) => value)) {
        log('[Settings] Some settings are not updated')
    } else {
        log('[Settings] All settings are updated')
        return
        z
    }

    const prepare = settingsDB.prepare(`UPDATE settings SET value = ? WHERE key = ?`)

    const updateMany = settingsDB.transaction(() => {
        for (const setting of existingSettings) {
            prepare.run(process.env[setting.key], setting.key)
        }
    })

    await updateMany()
}
