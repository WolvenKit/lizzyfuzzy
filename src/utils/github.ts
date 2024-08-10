import { App } from "octokit";
import fs from "fs";

const key = fs.readFileSync(
  "./src/keys/lizzyfuzzy.2024-08-10.private-key.pem",
  "utf-8"
);

const app = new App({
  appId: 966972,
  privateKey: key,
  auth: {
    id: 966972,
    privateKey: key,
    installationId: 53666733,
  },
  installationId: 53666733,
});

export const octokit = await app.getInstallationOctokit(53666733);
