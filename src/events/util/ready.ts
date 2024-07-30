import { event } from '../../utils';
const date = new Date().getHours()
const time = date < 12 ? 'Good Morning' : date < 18 ? 'Good Afternoon' : 'Good Night'

export default event('ready', async ({ log }, client) => {
  process.on('uncaughtException', error => {
    console.log(`uncaughtException:  ${error} `);
  });

  log(`${time}! I'm currently logged in as ${client.user.tag} and running on ${client.guilds.cache.size} servers!`);
  log(`I'm currently in ${client.channels.cache.size} channels and serving ${client.users.cache.size} users!`);
  log(`Run the command "Servers" for a list of servers I'm in!`);

});
