import type { IncomingMessage, ServerResponse } from 'node:http'
import { getUser, getUsers, getUserById } from './expoints'
import { fromDir } from 'utils'
import https from 'node:https'

const cert = fromDir('./src/resources/Api', '.crt')
const key = fromDir('./src/resources/Api', '.key')

var options: https.ServerOptions = {}

if (cert && key) {
    options = {
        key: key,
        cert: cert,
    }
}

export const server = https.createServer(
    options,
    (req: IncomingMessage, res: ServerResponse) => {
        const url = new URL(
            req.url!,
            `${cert && key ? 'https' : 'http'}://${req.headers.host}`
        )
        const query = new URLSearchParams(url.search)
        const path = url.pathname
        const method = req.method?.toLocaleLowerCase()

        const Data = {
            url: url,
            query: query,
            path: path,
            method: method,
        }

        const route = `${method}:${path}`

        switch (route) {
            case 'get:/web':
                getUsers(req, res, Data)
                break
            case 'get:/web/user':
                getUser(req, res, Data)
                break
            case 'get:/web/user/id':
                getUserById(req, res, Data)
                break
            case 'get:/':
                res.writeHead(302, { Location: '/web' })
                res.end()
                break
            default:
                if (new RegExp(/\/$/).test(path)) {
                    res.writeHead(302, {
                        Location:
                            path.slice(0, -1) +
                            (query.toString() ? `?${query.toString()}` : ''),
                    })
                    res.end()
                    return
                }
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Not Found' }))
                break
        }
    }
)
