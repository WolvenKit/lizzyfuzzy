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
  if (process.env.SHITPOST === channel.id) return;
  try {
    const Channel = client.channels.cache.get(
      String(process.env.SHITPOST)
    ) as TextChannel;
    if (channel.type !== 0) return;

    const auditLog = (await Channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
    })) as GuildAuditLogs;

    if (!auditLog) return;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;

    if (!entry) return;

    const logChannel = client.channels.cache.get(
      String(process.env.SHITPOST)
    ) as TextChannel;
    logChannel.send({
      content:
        "The channel name has been updated, and the server will live for another day! <a:cat_thrilled:1236320050214867035>",
      allowedMentions: { parse: [] },
    });
  } catch (error) {
    log("[Event Error]", error);
  }
});
