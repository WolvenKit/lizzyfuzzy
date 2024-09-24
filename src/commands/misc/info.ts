import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
  version,
} from "discord.js";
import { command } from "utils";
import os from "os";

const formatMemoryUsage = (data: any) =>
  `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

const memoryData = process.memoryUsage();

let timesBefore = os.cpus().map((c) => c.times);

function getAverageUsage() {
  let timesAfter = os.cpus().map((c) => c.times);
  let timeDeltas = timesAfter.map((t, i) => ({
    user: t.user - timesBefore[i].user,
    sys: t.sys - timesBefore[i].sys,
    idle: t.idle - timesBefore[i].idle,
  }));

  timesBefore = timesAfter;

  return (
    timeDeltas
      .map((times) => 1 - times.idle / (times.user + times.sys + times.idle))
      .reduce((l1, l2) => l1 + l2) / timeDeltas.length
  );
}

const meta = new SlashCommandBuilder()
  .setName("info")
  .setDescription("General information about the bot")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
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

  const memoryUsage = {
    rss: formatMemoryUsage(memoryData.rss),
    heapTotal: formatMemoryUsage(memoryData.heapTotal),
    heapUsed: formatMemoryUsage(memoryData.heapUsed),
    external: formatMemoryUsage(memoryData.external),
  };

  const embed = new EmbedBuilder()
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
        name: "Bot Library",
        value: "v" + version,
        inline: true,
      },
      {
        name: "Bot Version",
        value: "v" + process.env.npm_package_version?.toString() || "N/A",
        inline: true,
      },
      {
        name: "Uptime",
        value: `${uptime}`,
        inline: true,
      },
      {
        name: "CPU Usage",
        value: `${(getAverageUsage() * 100).toFixed(2)}% (average)` || "N/A",
        inline: true,
      },
      {
        name: "Memory usage",
        value: `RSS: ${memoryUsage.rss}\nHeap Total: ${memoryUsage.heapTotal}\nHeap Used:${memoryUsage.heapUsed}\nExternal:${memoryUsage.external}`,
        inline: true,
      },
      {
        name: "Stats",
        value: `Servers: ${interaction.client.guilds.cache.size}\nChannels: ${interaction.client.channels.cache.size}\nUsers: ${interaction.client.users.cache.size}`,
        inline: true,
      }
    )
    .setFooter({
      text: `Created on ${interaction.client.user?.createdAt.toUTCString()}`,
      iconURL: interaction.client.user?.displayAvatarURL(),
    })
    .setTimestamp()
    .toJSON();

  return interaction.reply({
    embeds: [embed],
  });
});
