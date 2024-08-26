declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Dict<string | boolean | number> {
        CLIENT_TOKEN: string;
        LOG_CHANNEL: string;
        GUILD: string;
        NODE_ENV: 'development' | 'production';
        JOINLEAVE_CHANNEL_ID: string;
        LOGS: string;
        API_RATE_WINDOW: string;
        API_MAX_REQUESTS: string;
        API_ENDPOINT: string;
        BOT_TOKEN: string;
      }

      interface Process extends EventEmitter {
        env: ProcessEnv;
      }
    }
  }
}
