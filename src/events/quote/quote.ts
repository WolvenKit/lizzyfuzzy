import { errorLog, event } from "utils";
import { GuildBasedChannel, Message, TextChannel } from "discord.js";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    const message = Message as Message;

    if (message.author.bot) return;
    if ((message.channel as TextChannel).nsfw === true) return;

    const regex =
      /(.*)((https:\/\/discord.com\/)(channels)\/(\d+)\/(\d+)\/(\d+))(.*)/g;
    const messageContent = regex.exec(Message.content);

    if (!messageContent) return;

    const NoGoChannels = [
      "786519136833372171", // Moderator Channel
      // "795081899756224572",  Shitpost Channel
      // "1335254657991315476",
    ];

    const GetOriginalMessage = async () => {
      if (
        message.guild?.id === messageContent?.[5] &&
        message.guild?.channels.cache.has(messageContent?.[6]!)
      ) {
        const channel = message.guild.channels.cache.get(
          messageContent?.[6]!
        ) as GuildBasedChannel as TextChannel;

        const originalMessage = await channel.messages.fetch(
          messageContent?.[7]!
        );

        return originalMessage;
      }
    };
    const originalMessage = (await GetOriginalMessage()) as Message;

    if (!originalMessage) return;

    if (NoGoChannels.includes(originalMessage.channel.id)) return;

    await originalMessage.forward(message.channel as TextChannel);
  } catch (error) {
    errorLog("[Event Error]", error);
  }
});
