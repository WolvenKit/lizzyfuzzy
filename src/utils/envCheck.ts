import { env } from "node:process";

function checkEnvVariable(variableName: string) {
  if (typeof env[variableName] === "string" && env[variableName].length === 0) {
    throw new Error(`${variableName} env is not set`);
  }
}

export function envCheck() {
  checkEnvVariable("CLIENT_TOKEN");
  checkEnvVariable("GUILD");
  checkEnvVariable("NODE_ENV");
  checkEnvVariable("LOGS");
  checkEnvVariable("API_RATE_WINDOW");
  checkEnvVariable("API_MAX_REQUESTS");
  checkEnvVariable("API_TOKEN");
// They are Set but not used atm, so we just commenting them out for now

//   checkEnvVariable("JOINLEAVE_CHANNEL_ID");
//   checkEnvVariable("LOG_CHANNEL");
}