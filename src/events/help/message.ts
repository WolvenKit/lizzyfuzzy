import { event } from "../../utils";
import type { TextChannel } from "discord.js";

export default event("messageCreate", async ({ log, client }, Message) => {
  try {
    const channel = Message.channel as TextChannel;

    // TODO - Make the check for the parent channel more dynamic

    if ((channel as TextChannel).parent?.id === "1266863501771669597") {
      if (Message.attachments.size > 0) {
        const attachment = Message.attachments.first();
        if (attachment?.contentType?.startsWith("text")) {
          if (attachment?.name?.startsWith("red4ext")) {
            const data = await fetch(attachment.url);
            const message = await data.text();

            const FileVersion = message.match(
              /(\[RED4ext\])\s(\[info\])\s(File version:)\s(.*)/
            );
            if (FileVersion?.[4] !== "3.0.76.64179") {
              const GamePath = message.match(
                /(\[RED4ext\])\s(\[info\])\s(Loading game's addresses from)\s(.*)/
              );

              const Paths = [];

              if (GamePath?.[4].includes)
                return Message.reply(
                  "It looks like you have a problem with red4ext. Please use the <#1266871506542002306> channel for support."
                );
            }
            if (channel.name !== "red4ext-support") {
              return Message.reply(
                "It looks like you have a problem with red4ext. Please use the <#1266871506542002306> channel for support."
              );
            }
          }
          if (attachment?.name?.startsWith("redscript")) {
            // const data = await fetch(attachment.url);
            // const message = await data.text();
          }
          if (attachment?.name?.startsWith("red4ext")) {
            // const data = await fetch(attachment.url);
            // const message = await data.text();
          }
        }
      }
    }
  } catch (error) {
    log(error);
  }
});
