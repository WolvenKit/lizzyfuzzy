declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv extends Dict<string | boolean | number> {
                CLIENT_TOKEN: string
                GUILD: string
                API_ENDPOINT: string
                NODE_ENV: 'development' | 'production'
                SUPPORT_MODERATOR_ROLE: string
                PRIMARY_GUILD: string
                SUPPORT_GUILD: string
                OPEN_TICKET_CATEGORY: string
                CLOSED_TICKET_CATEGORY: string
                XP_COEFFICIANT: number
                JOIN_LEAVE_CHANNEL: string
            }

            interface Process extends EventEmitter {
                env: ProcessEnv
            }
        }
    }
}
