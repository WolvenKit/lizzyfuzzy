import { event } from "utils";
import type { TextChannel } from "discord.js";

export default event("messageCreate", async ({ log, client }, Message) => {
  try {
    const channel = Message.channel as TextChannel;

    // TODO - Make the check for the parent channel more dynamic

    if (channel.parent?.id === "1266863501771669597") {
      if (Message.attachments.size > 0) {
        const attachment = Message.attachments.first();
        if (attachment?.contentType?.startsWith("text")) {
          if (attachment?.name?.startsWith("red4ext")) {
            const data = await fetch(attachment.url);
            const message = await data.text();

            const FileVersion =
              /(\[RED4ext\])\s(\[info\])\s(File version:)\s(.*)/.exec(message);
            if (FileVersion?.[4] !== "3.0.76.64179") {
              const GamePath =
                /(\[RED4ext\])\s(\[info\])\s(Loading game's addresses from)\s(.*)/.exec(
                  message
                );

              const Paths = [
                "fitgirl",
                "dodi",
                "dodirepack",
                "elamigos",
                "cryberpunk",
                "dodi-repacks",
              ];

              if (Paths.some((path) => GamePath?.[4].includes(path))) {
                return Message.reply(
                  "It looks like you are using a cracked version of the game. Please buy the game to get support. ?rule3"
                );
              }
            }
            if (channel.name !== "red4ext-support") {
              return Message.reply(
                "It looks like you have a problem with red4ext. Please use the <#1266871506542002306> channel for support."
              );
            }
          }
        }
      }
    }
  } catch (error) {
    log(error);
  }
});
