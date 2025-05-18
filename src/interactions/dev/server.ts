import type { ChatInputCommandInteraction, Client } from "discord.js";
import { log } from "utils";

export default async function server(
  interaction: ChatInputCommandInteraction,
  client: Client
) {
  const Servers = [...client.guilds.cache.map((g) => g)];

  Servers.forEach((server) => {
    log(server);
  });

  return interaction.reply({ content: "dev", flags: 64 });
}
