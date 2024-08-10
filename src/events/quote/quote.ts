import { event } from "utils";
import type { GuildBasedChannel, TextChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default event("messageCreate", async ({ log, client }, Message) => {
  try {
    if (Message.author.bot) return;
    const regex =
      /(.*)((https:\/\/discord.com\/)(channels)\/(\d+)\/(\d+)\/(\d+))(.*)/g;
    const messageContent = regex.exec(Message.content);
    const currentGuild = client.guilds.cache.get(process.env.GUILD);
    const UserHighestRoleColor = Message.member?.roles.highest.color ?? 0o0;

    if (
      currentGuild?.id === messageContent?.[5] &&
      currentGuild?.channels.cache.has(messageContent?.[6]!)
    ) {
      const channel = currentGuild.channels.cache.get(
        messageContent?.[6]!
      ) as GuildBasedChannel as TextChannel;

      const message = await channel.messages.fetch(messageContent?.[7]!);

      if (message.content) {
        const quotedMessage = new EmbedBuilder()
          .setAuthor({
            name: message.author.displayName,
            iconURL: message.author.displayAvatarURL(),
            url: messageContent?.[2]!,
          })
          .setDescription(message.content)
          .setFooter({
            text: `Quoted by ${Message.author.tag} from #${channel.name}`,
            iconURL: Message.author.displayAvatarURL(),
          })
          .setColor(UserHighestRoleColor)
          .setTimestamp(new Date());

        if (message.attachments.size > 0) {
          quotedMessage.setFields({
            name: "Attachments",
            value: message.attachments
              .map((attachment) => `[${attachment.name}](${attachment.url})`)
              .join("\n"),
          });
        }

        Message.reply({
          embeds: [quotedMessage],
          options: {
            allowedMentions: { parse: [] },
          },
        });
      } else if (message.embeds.length > 0) {
        const quotedMessage = new EmbedBuilder()
          .setAuthor({
            name: message.author.displayName,
            iconURL: message.author.displayAvatarURL(),
            url: messageContent?.[2]!,
          })
          .setDescription(message.embeds[0].description)
          .setFooter({
            text: `Quoted by ${Message.author.tag} from #${channel.name}`,
            iconURL: Message.author.displayAvatarURL(),
          })
          .setColor(UserHighestRoleColor)
          .setTimestamp(new Date());

        Message.reply({
          embeds: [quotedMessage],
          options: {
            allowedMentions: { parse: [] },
          },
        });
      } else if (
        message.embeds.length === 0 &&
        !message.content &&
        message.attachments.size > 0
      ) {
        const quotedMessage = new EmbedBuilder()
          .setAuthor({
            name: message.author.displayName,
            iconURL: message.author.displayAvatarURL(),
            url: messageContent?.[2]!,
          })
          .setDescription(
            message.attachments
              .map((attachment) => `[${attachment.name}](${attachment.url})`)
              .join("\n")
          )
          .setFooter({
            text: `Quoted by ${Message.author.tag} from #${channel.name}`,
            iconURL: Message.author.displayAvatarURL(),
          })
          .setColor(UserHighestRoleColor)
          .setTimestamp(new Date());

        Message.reply({
          embeds: [quotedMessage],
          options: {
            allowedMentions: { parse: [] },
          },
        });
      }
    }
  } catch (error) {
    log("[Event Error]", error);
  }
});
