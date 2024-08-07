import { event } from "../../utils";

export default event("ready", async ({ log }, client) => {
  process.on("uncaughtException", (error) => {
    console.log(`uncaughtException:  ${error} `);
  });

  log(
    `Logged as ${client.user.tag} | Running ${client.guilds.cache.size} server(s)!`
  );
});
