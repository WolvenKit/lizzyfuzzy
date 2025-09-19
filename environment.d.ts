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
                GITHUB_APP_KEY_FILE: string
                GITHUB_INSTALLATION_ID: string
            }

            interface Process extends EventEmitter {
                env: ProcessEnv
            }
        }
    }
}
