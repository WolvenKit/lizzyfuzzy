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

export default event("threadCreate", async ({ log, client }, Thread) => {
  if (process.env.LOGS !== "true") return;
  try {
    if (Thread.parent?.type === 0) {
      const thread = Thread as ThreadChannel;
      const auditLog = (await thread.guild.fetchAuditLogs({
        type: AuditLogEvent.ThreadCreate,
      })) as GuildAuditLogs;

      const entry = auditLog.entries.first() as GuildAuditLogsEntry;
      const executor = entry.executor as User;

      const embed = new EmbedBuilder()
        .setTitle(":green_circle: Thread Created")
        .setColor(0x2b2d31)
        .addFields(
          {
            name: ":thread: Thread name",
            value: `${thread.name}`,
            inline: true,
          },
          {
            name: ":tools: Created By",
            value: `<@${executor.id}>`,
            inline: true,
          },
          {
            name: ":no_entry: Is Private Thread?",
            value: `${
              thread.type === 12
                ? ":no_entry_sign: Is Private"
                : ":ballot_box_with_check: Is Public"
            }`,
            inline: true,
          },
          {
            name: "\u200b",
            value: `[Jump To Thread](${thread.url})`,
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
        type: AuditLogEvent.ThreadCreate,
      })) as GuildAuditLogs;

      const entry = auditLog.entries.first() as GuildAuditLogsEntry;
      const executor = entry.executor as User;

      const embed = new EmbedBuilder()
        .setTitle(":green_circle: Forum Post Created")
        .setColor(0x2b2d31)
        .addFields(
          {
            name: ":bookmark_tabs: Forum Post",
            value: `${thread.name}`,
            inline: true,
          },
          {
            name: ":tools: Created By",
            value: `<@${executor.id}>`,
            inline: true,
          },
          {
            name: ":no_entry: Is Private Post?",
            value: `${
              thread.type === 12
                ? ":no_entry_sign: Is Private"
                : ":ballot_box_with_check: Is Public"
            }`,
            inline: true,
          },
          {
            name: "\u200B",
            value: `[Jump To Forum Post](${thread.url})`,
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
