import { EmbedBuilder, TextChannel } from "discord.js";
import { event } from "utils";

export default event("guildMemberAdd", async ({ log, client }, Member) => {
  if (process.env.LOGS !== "true") return;
  try {
    const embed = new EmbedBuilder()
      .setTitle(":green_circle: User joined")
      .setThumbnail(Member.user.displayAvatarURL())
      .setColor(0x2b2d31)
      .addFields(
        { name: "User", value: `<@${Member.user.id}>` },
        { name: "Joined At", value: `${Member.joinedAt}` }
      )
      .setFooter({ text: `User ID: ${Member.user.id}` })
      .setTimestamp();

    if (Member.nickname !== null) {
      embed.addFields({ name: "Nickname", value: `${Member.nickname}` });
    }

    const logChannel = client.channels.cache.get(
      process.env.JOINLEAVE_CHANNEL_ID
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log("[Event Error]", error);
  }
});
