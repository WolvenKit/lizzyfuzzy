import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  TextChannel,
  User,
} from "discord.js";
import { event } from "utils";

export default event("guildBanRemove", async ({ log, client }, Ban) => {
  if (process.env.LOGS !== "true") return;
  try {
    const auditLog = (await Ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanRemove,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;

    const executor = entry.executor as User;

    const embed = new EmbedBuilder()
      .setTitle(":green_circle: User unBanned")
      .setThumbnail(Ban.user.displayAvatarURL())
      .setColor(0x2b2d31)
      .addFields(
        {
          name: "Username",
          value: `${Ban.user.username}`,
          inline: true,
        },
        {
          name: "User",
          value: `<@${Ban.user.id}>`,
          inline: true,
        },
        {
          name: "UnBanned By",
          value: `<@${executor.id}>`,
          inline: true,
        }
      )
      .setFooter({ text: `User ID: ${Ban.user.id}` })
      .setTimestamp();

    const logChannel = client.channels.cache.get(
      process.env.LOG_CHANNEL
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log("[Event Error]", error);
  }
});
