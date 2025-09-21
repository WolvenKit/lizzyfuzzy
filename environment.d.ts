declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv extends Dict<string | boolean | number> {
                CLIENT_TOKEN: string
                GUILD: string
                API_ENDPOINT: string
                API_KEY: string
                API_RATE_WINDOW: number
                API_MAX_REQUESTS: number
                NODE_ENV: 'development' | 'production'
                markedMembersChannel: string
                moderationCategory: string
                moderationLogChannel: string
                settingMarkedMemberRole: string
                CREATOR: string
                GET_COMMANDS: boolean
                USER_CHECKS: boolean
                NEXUSMODS_URI: string
                GITHUB_APP_ID: string
                GITHUB_URI: string
                GITHUB_INSTALLATION_ID: string
                POSTGRES_PASSWORD: string
                POSTGRES_USERNAME: string
                POSTGRES_URL: string
                POSTGRES_DATABASE: string
            }

            interface Process extends EventEmitter {
                env: ProcessEnv
            }
        }
    }
}
