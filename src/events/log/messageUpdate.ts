import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { event } from "utils";

export default event(
  "messageUpdate",
  async ({ log, client }, OldMessage, NewMessage) => {
    if (process.env.LOGS !== "true") return;
    try {
      const oldMessage = OldMessage as Message;
      const newMessage = NewMessage as Message;

      if (oldMessage.author.bot) return;
      if (oldMessage.content === newMessage.content) return;

      const messageChannel = oldMessage.guild?.channels.cache.find(
        (channel) => channel.id === oldMessage.channel.id
      );

      const embed = new EmbedBuilder()
        .setTitle("Message Edited")
        .setColor(0x2b2d31)
        .setDescription(
          `${
            oldMessage.content.length <= 4096
              ? oldMessage.content
              : "Message exeeds the 4096 character limit and cannot be displayed!"
          }`
        )
        .addFields(
          { name: "Author", value: `<@${oldMessage.author.id}>`, inline: true },
          { name: "Channel", value: `${messageChannel}`, inline: true },
          {
            name: "Edited By",
            value: `<@${newMessage.author.id}>`,
            inline: true,
          },
          { name: "\u200B", value: `[Jump To Message](${OldMessage.url})` }
        )
        .setFooter({ text: `Message ID: ${oldMessage.id}` })
        .setTimestamp();

      const logChannel = client.channels.cache.get(
        process.env.LOG_CHANNEL
      ) as TextChannel;
      logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
    } catch (error) {
      log("[Event Error]", error);
    }
  }
);
