import { event } from "../../utils";
import dns from "dns";
const date = new Date().getHours();
const time =
  date < 12 ? "Good Morning" : date < 18 ? "Good Afternoon" : "Good Night";

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

  //  periodicaly check for internet connection
  dns.resolve("www.google.com", function (err: any) {
    if (err) {
      log("No internet connection!");
    } else {
      log("Internet connection is available!");
    }
  });

  setInterval(() => {
    dns.resolve("www.google.com", function (err: any) {
      if (err) {
        log("No internet connection!");
      } else {
        log("Internet connection is available!");
      }
    });
  }, 600000);
});
