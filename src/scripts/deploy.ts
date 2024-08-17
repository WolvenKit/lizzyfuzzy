import { REST, Routes, APIUser } from "discord.js";
import commands from "commands";
import { log, keys } from "utils";

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: "10" }).setToken(keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint =
    process.env.NODE_ENV === "production"
      ? Routes.applicationCommands(currentUser.id)
      : Routes.applicationGuildCommands(currentUser.id, keys.guild);

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then(async (user) => {
    const tag = `${user.username}#${user.discriminator}`;
    const guild = await rest.get(Routes.guild(keys.guild)) as any;
    const response =
      process.env.NODE_ENV === "production"
        ? `Successfully released commands in production as ${tag}!`
        : `Successfully registered commands for development in ${guild.name} as ${tag}`;

    log(response);
  })
  .catch(console.error);
