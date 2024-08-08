import { event } from "utils";
export default event("guildCreate", async ({ log }, Guild) => {
  log(`Joind Guild: ${Guild.id}`);
});
