import type { IncomingMessage, ServerResponse } from 'node:http'
import { userDB } from 'src/utils'

interface Data {
    url: URL
    query: URLSearchParams
    path: string
    method: string | undefined
}

type UserRowRaw = {
    id: number
    username: string
    globalname: string
    avatar: string | null
    discordid: string
    theme: string | null
    style: string | null
    description: string | null
    githubusername: string | null
    nexusmodsusername: string | null
    nexusmods: string | null // stored as text in SQLite
    github: string | null // stored as text in SQLite
    roles: string
}

type UserRow = Omit<UserRowRaw, 'nexusmods' | 'github'> & {
    nexusmods: Record<string, unknown>
    github: Record<string, unknown>
}

export function getUsers(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('page') || '1'

    const stmt = userDB.query<UserRowRaw, [number]>(`
  SELECT *
  FROM users
  LIMIT 10 OFFSET ?
`)

    const result: UserRow[] = stmt
        .all((parseInt(pageQuery) - 1) * 10) // pass as number, not [number]
        .map((row) => ({
            ...row,
            nexusmods: JSON.parse(row.nexusmods ?? '{}'),
            github: JSON.parse(row.github ?? '{}'),
        }))

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ page: pageQuery, users: result }))
}

export function getUser(req: IncomingMessage, res: ServerResponse, data: Data) {
    const pageQuery = data.query.get('q')?.toLocaleLowerCase()!

    const stml = userDB.query('SELECT * FROM users WHERE username = ?')
    const result = stml.all(pageQuery)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
}

export function getUserById(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('q')?.toLocaleLowerCase()!

    const stml = userDB.query('SELECT * FROM users WHERE discordid = ?')
    const result = stml.all(pageQuery)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(result)
}
