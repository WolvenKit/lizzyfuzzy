import { REST, Routes, APIUser } from "discord.js";
import commands from "src/interactions";
import { log, keys } from "utils";

const body = commands
  .map((cmd) => [cmd.meta, cmd.local, cmd.dev])
  .flat();
const rest = new REST({ version: "10" }).setToken(keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  if (process.env.NODE_ENV === "production") {
    log("Production mode");
    const endpoint = {
      global: Routes.applicationCommands(currentUser.id),
      local: Routes.applicationGuildCommands(currentUser.id, keys.guild),
    };

    await rest.put(endpoint.global, {
      body: body
        .filter((cmd) => cmd[2] === false)
        .filter((cmd) => cmd[1] === false)
        .map((cmd) => cmd[0]),
    });

    await rest.put(endpoint.local, {
      body: body
        .filter((cmd) => cmd[2] === false)
        .filter((cmd) => cmd[1] === true)
        .map((cmd) => cmd[0]),
    });

    return currentUser;
  } else {
    log("Development mode");
    const endpoint = {
      global: Routes.applicationCommands(currentUser.id),
      local: Routes.applicationGuildCommands(currentUser.id, "1278051511087399114"),
    };

    await rest.put(endpoint.local, {
      body: body.map((cmd) => cmd[0]),
    });

    await rest.put(endpoint.global, {
      body: [],
    });

    return currentUser;
  }
}

main().catch(console.error);
