import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("servers")
  .setDescription("dev command to list all servers the bot is in.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default command(meta, async ({ interaction, client }) => {
  const Servers = [...client.guilds.cache.map((g) => g.id)];
  console.log(Servers);
  interaction.reply({ content: "dev", ephemeral: true });
});
