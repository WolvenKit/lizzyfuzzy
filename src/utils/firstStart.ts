import { db, readSQL, log } from 'utils'
import fs from 'node:fs'
import path from 'node:path'

export async function firstStart() {
    await db.unsafe(readSQL().postgresInit)

    const quotesData = fs.readFileSync(path.join(__dirname, '../resources/quotes.json'), 'utf-8')

    const quotesCount = await db`SELECT * FROM quotes`
    if (quotesCount.length > 0) {
        log('Quotes table already initialized.')
        return
    }

    const quotes = JSON.parse(quotesData) as {
        quote: string
        responde: string
        server: string
    }[]

    for (const quote of quotes) {
        await db`INSERT INTO quotes (quote, responde, server) VALUES (${quote.quote}, ${quote.responde}, ${quote.server})`
    }

    log('Database initialized and quotes imported.')
}
