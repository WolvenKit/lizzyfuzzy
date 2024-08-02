import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { command } from "../../utils";
import client from "prom-client"

const gauge = new client.Gauge({ name: 'uptime', help: 'Uptime of the bot' });

const meta = new SlashCommandBuilder()
  .setName("info")
  .setDescription("General information about the bot")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  gauge.inc(1)
  const uptime = interaction.client.uptime
    ? formatUptime(interaction.client.uptime)
    : "N/A";
  function formatUptime(uptime: number): string {
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#7289DA")
        .setTitle("Bot Information")
        .addFields(
          {
            name: "Bot Name",
            value: `${interaction.client.user?.username}`,
            inline: true,
          },
          {
            name: "Bot ID",
            value: `${interaction.client.user?.id}`,
            inline: true,
          },
          {
            name: "Bot Creation Date",
            value: `${interaction.client.user?.createdAt}`,
            inline: true,
          },
          {
            name: "Bot Library",
            value: "Discord.js@" + process.version,
            inline: true,
          },
          {
            name: "Bot Version",
            value: `0.0.1`,
            inline: true,
          },
          {
            name: "Uptime",
            value: `${uptime}`,
            inline: true,
          },
          {
            name: "Resource Usage",
            value:
              `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )}MB` +
              "\n" +
              `CPU: ${(
                process.cpuUsage().user / 1000000 +
                process.cpuUsage().system / 1000000
              ).toFixed(2)}ms` +
              "\n" +
              `CPU: ${process.cpuUsage().user / 1000000}ms (User) ${
                process.cpuUsage().system / 1000000
              }ms (System)`,

            inline: true,
          }
        )
        .setTimestamp()
        .toJSON(),
    ],
  });
});
