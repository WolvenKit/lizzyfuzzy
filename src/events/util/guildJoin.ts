import { event } from "utils";
export default event("guildCreate", async ({ log }, Guild) => {
  log(`Joined Guild: ${Guild.id}`);
});
