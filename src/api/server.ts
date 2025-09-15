import http from 'http'

const requestListener = (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json')
    switch (req.url) {
        case '/':
            res.end(JSON.stringify())
            break
        default:
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Not Found' }))
            break
    }
}

export const server = http.createServer(requestListener)
