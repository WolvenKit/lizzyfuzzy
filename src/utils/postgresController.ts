import { SQL } from 'bun'

export const db = new SQL({
    adapter: 'postgres',
    hostname: process.env.POSTGRES_URL,
    port: 5432,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
})

db``
