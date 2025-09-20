import * as fs from 'fs'
import * as path from 'path'

function createDir(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath)
    }
}

export function generateGraphQLTypes() {
    const dir = path.resolve(__dirname, '../resources/GraphQL')

    // read files in the directory
    const files = fs.readdirSync(dir)

    // convert to keys without extension
    const keys = files.map((f) => JSON.parse(JSON.stringify(f.split('.')[0])))

    // create a union type
    const typeDef = `
// AUTO-GENERATED FILE. DO NOT EDIT.

export type GraphQLFileKey =
  ${keys.map((k) => `"${k}"`).join(' | ')};
`
    createDir('./src/types/generated')

    fs.writeFileSync(
        path.resolve(__dirname, '../types/generated/graphql.d.ts'),
        typeDef
    )
}
