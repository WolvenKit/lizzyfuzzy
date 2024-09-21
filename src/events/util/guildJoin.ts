import { event, log } from "utils";
export default event("guildCreate", async ({ }, Guild) => {
  log(`Joined Guild: ${Guild.id}`);
});
