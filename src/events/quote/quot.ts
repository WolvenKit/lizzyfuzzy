import { errorLog, event, log } from "utils";
import { GuildBasedChannel, TextChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    if (Message.author.bot) return;
    if ((Message.channel as TextChannel).nsfw === true) return;

    const NoGoChannels = [
      "786519136833372171", // Moderator Channel
      "795081899756224572", // Shitpost Channel
    ]

    if (NoGoChannels.includes(Message.channel.id)) return;

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
            embeds: [
              {
                description: message.content,
                image: {
                  url: image[0],
                },
                footer: {
                  text: `Quoted by ${Message.author.tag} from #${channel.name}`,
                  icon_url: Message.author.displayAvatarURL(),
                },
                author: {
                  name: message.author.displayName,
                  icon_url: message.author.displayAvatarURL(),
                  url: messageContent?.[2]!,
                },
              },
            ],
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
          quotedMessage.setImage(
            Array.from(message.attachments.values())[0].url
          );

          quotedMessage.setFields({
            name: "All Attachments",
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
            embeds: [
              {
                image: {
                  url: attachment.url,
                },
                footer: {
                  text: `Quoted by ${Message.author.tag} from #${channel.name}`,
                  icon_url: Message.author.displayAvatarURL(),
                },
                author: {
                  name: message.author.displayName,
                  icon_url: message.author.displayAvatarURL(),
                  url: messageContent?.[2]!,
                },
              },
            ],
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
    errorLog("[Event Error]", error);
  }
});
