import {
  AuditLogEvent,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  User,
} from "discord.js";
import { event } from "utils";

export default event("guildMemberRemove", async ({ log }, MemberKick) => {
  try {
    const auditLog = (await MemberKick.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberKick,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const body = {
      Type: "Kick",
      DiscordId: MemberKick.user.id,
      User: MemberKick.user.username,
      Reason: entry.reason ? `${entry.reason}` : "No Reason Given",
      Issuer: executor.id,
      GuildId: MemberKick.guild.id,
    };

    const data = await fetch(process.env.API_ENDPOINT + "/moderation/kick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response)
      .then((data) => data.json())
      .catch((error) => console.error(error));

    console.log(data);
  } catch (error) {
    log("[Event Error]", error);
  }
});
