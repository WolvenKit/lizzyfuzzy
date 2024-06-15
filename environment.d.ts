declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Dict<string | boolean | number> {
        CLIENT_TOKEN: string;
        LOG_CHANNEL: string;
        GUILD: string;
        NODE_ENV: 'development' | 'production';
      }

      interface Process extends EventEmitter {
        env: ProcessEnv;
      }
    }
  }
}
