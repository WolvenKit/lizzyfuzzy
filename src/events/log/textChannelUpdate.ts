import {
  EmbedBuilder,
  TextChannel,
  AuditLogEvent,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  User,
} from "discord.js";
import { event } from "utils";

export default event("channelUpdate", async ({ log, client }, channel) => {
  if (process.env.LOGS !== "true") return;
  try {
    const Channel = channel as TextChannel;
    if (channel.type !== 0) return;

    const auditLog = (await Channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ThreadUpdate,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const embed = new EmbedBuilder()
      .setTitle(":yellow_circle: Channel Updated")
      .setColor(0x2b2d31)
      .addFields(
        {
          name: ":closed_book: Channel Name",
          value: `<#${Channel.id}>`,
          inline: true,
        },
        {
          name: ":green_book: Category Name",
          value: Channel.parent?.name ?? "No Category",
          inline: true,
        },
        { name: ":gear: Updated By", value: `<@${executor.id}>`, inline: true }
      )
      .setFooter({ text: `Channel ID: ${Channel.id}` })
      .setTimestamp();

    const logChannel = client.channels.cache.get(
      process.env.LOG_CHANNEL
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log("[Event Error]", error);
  }
});
