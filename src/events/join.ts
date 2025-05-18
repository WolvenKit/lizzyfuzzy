import { errorLog, event } from "utils";
import {
  Component,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";

import joinmsg from "../../fallback/joinmsg.md";

export default event("guildMemberAdd", async ({ client }, UserJoin) => {
  if (UserJoin.user.bot) return;

  console.log(`User ${UserJoin.user.username} joined the server.`);

  const Container = new ContainerBuilder({
    components: [
      {
        type: ComponentType.MediaGallery,
        items: [
          {
            media: {
              url: "https://files.moonded.com/RedModding/cyberpunk-header.jpg",
            },
          },
        ],
      },
      {
        type: ComponentType.TextDisplay,
        content: joinmsg,
      },
    ],
  });

  UserJoin.send({
    components: [Container],
    flags: MessageFlags.IsComponentsV2,
  });
});
