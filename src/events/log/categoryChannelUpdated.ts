import {
  EmbedBuilder,
  TextChannel,
  AuditLogEvent,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  User,
  CategoryChannel,
} from "discord.js";
import { event } from "utils";

export default event("channelUpdate", async ({ log, client }, channel) => {
  if (process.env.LOGS !== "true") return;
  try {
    const Channel = channel as CategoryChannel;
    if (channel.type !== 4) return;

    const auditLog = (await Channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ThreadUpdate,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const embed = new EmbedBuilder()
      .setTitle(":yellow_circle: CategoryChannel Updated")
      .setColor(0x2b2d31)
      .addFields(
        {
          name: ":green_book: CategoryChannel Name",
          value: `${Channel.name}`,
          inline: true,
        },
        { name: ":gear: Updated By", value: `<@${executor.id}>`, inline: true }
      )
      .setFooter({ text: `Category ID: ${Channel.id}` })
      .setTimestamp();

    const logChannel = client.channels.cache.get(
      process.env.LOG_CHANNEL
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log("[Event Error]", error);
  }
});
