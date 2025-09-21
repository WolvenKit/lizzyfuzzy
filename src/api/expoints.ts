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

type UserRow = Omit<UserRowRaw, 'nexusmods' | 'github' | 'roles'> & {
    nexusmods: Record<string, unknown>
    github: Record<string, unknown>
    roles: Record<string, unknown>
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
        .all((parseInt(pageQuery) - 1) * 10)
        .map((row) => ({
            ...row,
            nexusmods: JSON.parse(row.nexusmods ?? '{}'),
            github: JSON.parse(row.github ?? '{}'),
            roles: JSON.parse(row.roles ?? '{}'),
        }))

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ page: pageQuery, users: result }))
}

export function getUser(req: IncomingMessage, res: ServerResponse, data: Data) {
    const pageQuery = data.query.get('q')?.toLocaleLowerCase()!

    const stmt = userDB.query<UserRowRaw, [string]>(
        'SELECT * FROM users WHERE username = ?'
    )

    const result: UserRow[] = stmt.all(pageQuery).map((row) => ({
        ...row,
        nexusmods: JSON.parse(row.nexusmods ?? '{}'),
        github: JSON.parse(row.github ?? '{}'),
        roles: JSON.parse(row.roles ?? '{}'),
    }))

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
}

export function getUserById(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('q')?.toLowerCase()!

    const stmt = userDB.query<UserRowRaw, [string]>(
        'SELECT * FROM users WHERE discordid = ?'
    )

    const result: UserRow[] = stmt.all(pageQuery).map((row) => ({
        ...row,
        nexusmods: JSON.parse(row.nexusmods ?? '{}'),
        github: JSON.parse(row.github ?? '{}'),
        roles: JSON.parse(row.roles ?? '{}'),
    }))

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
}
