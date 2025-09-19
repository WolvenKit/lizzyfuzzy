import { Database } from 'bun:sqlite'
import fs from 'node:fs'
import { errorLog, log } from './logging'

export const localBD = new Database('./src/database/api.sqlite', {
    create: true,
})

export const commandDB = new Database('./src/database/commands.sqlite', {
    create: true,
})

export const userDB = new Database('./src/database/users.sqlite', {
    create: true,
})

export function prepareDatabase() {
    try {
        const t1 = localBD
            .query(
                `SELECT name
        FROM sqlite_master
        WHERE type='table' AND name='quotes';`
            )
            .get()

        const t2 = commandDB
            .query(
                `SELECT name
        FROM sqlite_master
        WHERE type='table' AND name='commands';`
            )
            .get()

        const t3 = userDB.query(
            `SELECT name
        FROM sqlite_master
        WHERE type='table' AND name='users';`
        ).get()

        if (!t1 || !t2 || !t3) {
            log('[PrepareDatabase] Running preperation.')

            localBD.run(fs.readFileSync('./src/resources/SQL/localdb.sql', 'utf-8'))
            commandDB.run(fs.readFileSync('./src/resources/SQL/commands.sql', 'utf-8'))
            userDB.run(fs.readFileSync('./src/resources/SQL/users.sql', 'utf-8'))

            log('[PrepareDatabase] Database prepared!')
        }
    } catch (e) {
        errorLog(e)
    }
}

interface quotes {
    quote: string
    responde: string
    server: string
}

export function populateDatabase() {
    try {
        const commands = commandDB.query('SELECT name FROM commands').get()

        if (!commands) {
            const files = fs.readdirSync('./src/resources/Commands')
            files.forEach((file) => {
                const filename = file.split('.')[0]
                const fileContent = fs.readFileSync(`./src/resources/Commands/${file}`, 'utf-8').toString()

                commandDB.run('INSERT INTO commands (isEmbed, name, content) VALUES ( ?, ?, ?)', [true, filename, fileContent])
            })
        }

        const quotes = localBD.query('SELECT quote from quotes').get()

        if (!quotes) {
            log('Populating Quotes')
            const quotes = JSON.parse(fs.readFileSync('./src/resources/quotes.json', 'utf-8').toString()) as quotes[]

            quotes.forEach((quote) => {
                localBD.run('INSERT INTO quotes (quote, responde, server) VALUES ( ?, ?, ?) ', [quote.quote, quote.responde, quote.server])
            })
            log('Finished populating Quotes')
        }
    } catch (e) {
        errorLog(e)
    }
}
