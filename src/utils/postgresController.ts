import { SQL } from 'bun'

export const db = new SQL(
    `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_URL}:5432/${process.env.POSTGRES_DATABASE}`
)
