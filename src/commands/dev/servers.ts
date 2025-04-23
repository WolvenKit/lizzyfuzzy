import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command, log } from "utils";

const meta = new SlashCommandBuilder()
  .setName("servers")
  .setDescription("dev command to list all servers the bot is in.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const Servers = [...client.guilds.cache.map((g) => g)];

  Servers.forEach((server) => {
    log(server);
  });

  interaction.reply({ content: "dev", flags: 64 });
}, true, true);
