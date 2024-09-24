import { event, log, errorLog } from "utils";

export default event("ready", async ({}, client) => {
  process.on("uncaughtException", (error) => {
    errorLog(`uncaughtException:  ${error} `);
  });

  log(
    `Logged as ${client.user.tag} | Running ${client.guilds.cache.size} server(s)!`
  );
});
