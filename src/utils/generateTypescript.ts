import * as fs from 'fs'
import * as path from 'path'

function createDir(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath)
    }
}

export function generateTypes() {
    generateGraphQLTypes()
    generateSQLTypes()
    autoExport()
}

function autoExport() {
    const dir = path.resolve(__dirname, '../types/generated')
    const files = fs.readdirSync(dir).filter((n) => n !== 'index.d.ts')

    const exportDef = `
// AUTO-GENERATED FILE. DO NOT EDIT.

${files.map((k) => `export * from "./${k}"`).join('\n')}`
    createDir('./src/types/generated')

    fs.writeFileSync(path.resolve(__dirname, '../types/generated/index.d.ts'), exportDef)
}

function generateGraphQLTypes() {
    const dir = path.resolve(__dirname, '../resources/GraphQL')
    const files = fs.readdirSync(dir)
    const keys = files.map((f) => JSON.parse(JSON.stringify(f.split('.')[0])))

    const typeDef = `
// AUTO-GENERATED FILE. DO NOT EDIT.

export type GraphQLFileKey =
  ${keys.map((k) => `"${k}"`).join(' | ')};
`
    createDir('./src/types/generated')

    fs.writeFileSync(path.resolve(__dirname, '../types/generated/graphql.d.ts'), typeDef)
}

function generateSQLTypes() {
    const dir = path.resolve(__dirname, '../resources/SQL')
    const files = fs.readdirSync(dir)
    const keys = files.map((f) => JSON.parse(JSON.stringify(f.split('.')[0])))

    const typeDef = `
// AUTO-GENERATED FILE. DO NOT EDIT.

export type SQLFileKey =
  ${keys.map((k) => `"${k}"`).join(' | ')};
`
    createDir('./src/types/generated')

    fs.writeFileSync(path.resolve(__dirname, '../types/generated/sql.d.ts'), typeDef)
}
