import Database from 'bun:sqlite'

const db = new Database('./database/database.sqlite')

export function inputSpeech(keywords: string, text: string, type: string) {
    db.prepare(`INSERT INTO speech (keywords, text, type) VALUES ($keywords, $text, $type)`).run({
        keywords: keywords,
        text: text,
        type: type,
    })
    return
}
