import type { GuildAuditLogsEntry, GuildAuditLogs, User } from "discord.js";
import { AuditLogEvent } from "discord.js";
import { event } from "utils";

export default event("guildBanAdd", async ({ log }, Ban) => {
  try {
    const auditLog = (await Ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const data = await fetch(process.env.API_ENDPOINT + "/moderation/ban", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Type: "Ban",
        DiscordId: Ban.user.id,
        User: Ban.user.username,
        Reason: entry.reason ? `${entry.reason}` : "No Reason Given",
        Issuer: executor.id,
      }),
    })
      .then((response) => response)
      .then((data) => data.json())
      .catch((error) => console.error(error));

    console.log(data);
  } catch (error) {
    log("[Event Error]", error);
  }
});
