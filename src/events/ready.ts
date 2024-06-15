import { event } from '../utils';
export default event('ready', async ({ log }, client) => {
  process.on('uncaughtException', error => {
    console.log(`uncaughtException:  ${error} `);
  });

  log(`Logged in as ${client.user.tag}`);
});
