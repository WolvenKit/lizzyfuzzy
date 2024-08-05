import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  TextChannel,
  User,
} from "discord.js";
import { event } from "../../utils";

export default event("guildBanAdd", async ({ log, client }, Ban) => {
  try {
    const auditLog = (await Ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const embed = new EmbedBuilder()
      .setTitle(":red_circle: User Banned")
      .setThumbnail(Ban.user.displayAvatarURL())
      .setColor(0x2b2d31)
      .addFields(
        { name: "User", value: `<@${Ban.user.id}>`, inline: true },
        { name: "Banned By", value: `<@${executor.id}>`, inline: true },
        {
          name: "Reason",
          value: entry.reason ? `${entry.reason}` : "No Reason Given",
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
