import { db } from 'src/index'
import { errorLog, log } from 'src/utils'
import fs from 'node:fs'

export async function createTable() {
    const dir = fs.readdirSync('src/tables')

    if (!dir) return
    if (!dir.length) return

    dir.map(async (i) => {
        const file = Bun.file('src/tables/' + i)

        try {
            const content = await file.text()
            if (!content.length) return

            db.run(content)

            return log('Run ' + i + ' without failure.')
        } catch (error) {
            errorLog(error)
        }
    })
}
