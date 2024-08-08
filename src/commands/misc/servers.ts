import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";
import client from "prom-client";

const gauge = new client.Counter({
  name: "command_servers_usage",
  help: "Usage of the server command",
});

const meta = new SlashCommandBuilder()
  .setName("servers")
  .setDescription("dev command to list all servers the bot is in.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  gauge.inc(1);
  const Servers = [...client.guilds.cache.map((g) => g.id)];
  console.log(Servers);
  interaction.reply({ content: "dev", ephemeral: true });
});
