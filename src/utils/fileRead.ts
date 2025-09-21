import { errorLog } from './logging'
import path from 'path'
import fs from 'fs'
import type { GraphQLFileKey, SQLFileKey } from '../types/generated'

export function fromDir(startPath: string, filter: string) {
    if (!fs.existsSync(startPath)) {
        errorLog('no dir ', startPath)
        return ''
    }

    var files = fs.readdirSync(startPath)
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i])
        var stat = fs.lstatSync(filename)
        if (stat.isDirectory()) {
            fromDir(filename, filter)
        } else if (filename.endsWith(filter)) {
            return fs.readFileSync(filename, 'utf-8')
        }
    }

    return ''
}

export function GraphQL(): Record<GraphQLFileKey, string> {
    const Path = './src/resources/GraphQL'
    const files = fs.readdirSync(Path)

    const fileData = {} as Record<GraphQLFileKey, string>

    files.forEach((a) => {
        const filename = path.join(Path, a)
        const key = a.split('.')[0] as GraphQLFileKey
        fileData[key] = fs.readFileSync(filename, 'utf-8')
    })

    return fileData
}

export function readSQL(): Record<SQLFileKey, string> {
    const Path = './src/resources/SQL'
    const files = fs.readdirSync(Path)

    const fileData = {} as Record<SQLFileKey, string>

    files.forEach((a) => {
        const filename = path.join(Path, a)
        const key = a.split('.')[0] as SQLFileKey
        fileData[key] = fs.readFileSync(filename, 'utf-8')
    })

    return fileData
}
