import type { IncomingMessage, ServerResponse } from 'node:http'
import { userDB, db } from 'src/utils'

interface Data {
    url: URL
    query: URLSearchParams
    path: string
    method: string | undefined
}

export async function getUsers(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('page') || '1'

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
        JSON.stringify({
            page: pageQuery,
            users: await db`SELECT username, globalname, avatar, discordid, theme, style, description, githubusername, nexusmodsusername, nexusmods, github, roles FROM users LIMIT 10 OFFSET ${
                (parseInt(pageQuery) - 1) * 10
            }`,
        })
    )
}

export async function getUser(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('q')?.toLocaleLowerCase()!

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
        JSON.stringify(
            await db`SELECT username, globalname, avatar, discordid, theme, style, description, githubusername, nexusmodsusername, nexusmods, github, roles FROM users WHERE username = ${pageQuery}`
        )
    )
}

export async function getUserById(
    req: IncomingMessage,
    res: ServerResponse,
    data: Data
) {
    const pageQuery = data.query.get('q')?.toLowerCase()!

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
        JSON.stringify(
            await db`SELECT username, globalname, avatar, discordid, theme, style, description, githubusername, nexusmodsusername, nexusmods, github, roles FROM users WHERE discordid = ${pageQuery}`
        )
    )
}
