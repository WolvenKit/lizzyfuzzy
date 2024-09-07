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
        const imageregex = /(https?:\/\/.*\.(?:png|jpg))/g;
        const image = imageregex.exec(message.content);

        if (image) {
          return Message.reply({
            content: image[0],
            options: {
              allowedMentions: { parse: [] },
            },
          });
        }

        const videoregex = /(https?:\/\/.*\.(?:mp4|webm))/g;
        const video = videoregex.exec(message.content);

        if (video) {
          return Message.reply({
            content: video[0],
            options: {
              allowedMentions: { parse: [] },
            },
          });
        }

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

        return Message.reply({
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

        return Message.reply({
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
        const attachment = Array.from(message.attachments.values())[0];

        if (attachment?.contentType?.includes("image")) {
          return Message.reply({
            content: attachment.url,
            options: {
              allowedMentions: { parse: [] },
            },
          });
        }

        if (attachment?.contentType?.includes("video")) {
          return Message.reply({
            content: attachment.url,
            options: {
              allowedMentions: { parse: [] },
            },
          });
        }

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

        return Message.reply({
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
