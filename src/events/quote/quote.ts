import { event } from "utils";
import type { GuildBasedChannel, TextChannel } from "discord.js";

export default event("messageCreate", async ({ log, client }, Message) => {
  try {
    if (Message.author.bot) return;

    const messageContent = Message.content.split("/").slice(-3);
    const currentGuild = client.guilds.cache.get(process.env.GUILD);

    if (
      currentGuild?.id === messageContent[0] &&
      currentGuild.channels.cache.has(messageContent[1])
    ) {
      const channel = currentGuild.channels.cache.get(
        messageContent[1]
      ) as GuildBasedChannel as TextChannel;

      const message = await channel.messages.fetch(messageContent[2]);

      if (!message.content) return;

      Message.reply({
        embeds: [
          {
            author: {
              name: message.author.displayName,
              icon_url: message.author.displayAvatarURL(),
              url: Message.content,
            },
            description: message.content,
            footer: {
              text: `Quoted by ${Message.author.tag} from #${channel.name}`,
              icon_url: Message.author.displayAvatarURL(),
            },
            timestamp: new Date().toISOString(),
          },
        ],
        options: {
          allowedMentions: { parse: [] },
        },
      });
    }
  } catch (error) {
    log("[Event Error]", error);
  }
});
