import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  TextChannel,
  ThreadChannel,
  User,
} from "discord.js";
import { event } from "utils";

export default event("threadDelete", async ({ log, client }, Thread) => {
  if (process.env.LOGS !== "true") return;
  try {
    if (Thread.parent?.type === 0) {
      const thread = Thread as ThreadChannel;

      const auditLog = (await thread.guild.fetchAuditLogs({
        type: AuditLogEvent.ThreadDelete,
      })) as GuildAuditLogs;

      const entry = auditLog.entries.first() as GuildAuditLogsEntry;
      const executor = entry.executor as User;

      const embed = new EmbedBuilder()
        .setTitle(":red_circle: Thread Deleted")
        .setColor(0x2b2d31)
        .addFields(
          {
            name: ":thread: Thread",
            value: `${thread.name}`,
            inline: true,
          },
          {
            name: ":wastebasket: Deleted By",
            value: `<@${executor.id}>`,
            inline: true,
          }
        )
        .setFooter({ text: `Thread ID: ${thread.id}` })
        .setTimestamp();

      const logChannel = client.channels.cache.get(
        process.env.LOG_CHANNEL
      ) as TextChannel;
      logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
    } else if (Thread.parent?.type === 15) {
      const thread = Thread as ThreadChannel;

      const auditLog = (await thread.guild.fetchAuditLogs({
        type: AuditLogEvent.ThreadDelete,
      })) as GuildAuditLogs;

      const entry = auditLog.entries.first() as GuildAuditLogsEntry;
      const executor = entry.executor as User;

      const embed = new EmbedBuilder()
        .setTitle(":red_circle: Forum Post Deleted")
        .setColor(0x2b2d31)
        .addFields(
          {
            name: ":bookmark_tabs: Forum Post",
            value: `${thread.name}`,
            inline: true,
          },
          {
            name: ":wastebasket: Deleted By",
            value: `<@${executor.id}>`,
            inline: true,
          }
        )
        .setFooter({ text: `Forum Post ID: ${thread.id}` })
        .setTimestamp();

      const logChannel = client.channels.cache.get(
        process.env.LOG_CHANNEL
      ) as TextChannel;
      logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
    }
  } catch (error) {
    log("[Event Error]", error);
  }
});
