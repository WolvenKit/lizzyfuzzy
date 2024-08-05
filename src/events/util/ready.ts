import { event } from "../../utils";
const date = new Date().getHours();

let time;
if (date < 12) {
  time = "Good Morning";
} else if (date < 18) {
  time = "Good Afternoon";
} else {
  time = "Good Night";
}

export default event("ready", async ({ log }, client) => {
  process.on("uncaughtException", (error) => {
    console.log(`uncaughtException:  ${error} `);
  });

  log(
    `${time}! I'm currently logged in as ${client.user.tag} and running on ${client.guilds.cache.size} servers!`
  );
  log(
    `I'm currently in ${client.channels.cache.size} channels and serving ${client.users.cache.size} users!`
  );
  log(`Run the command "Servers" for a list of servers I'm in!`);
});
