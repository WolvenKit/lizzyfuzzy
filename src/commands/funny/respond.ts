import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command, errorLog } from "utils";

const meta = new SlashCommandBuilder()
  .setName("respond")
  .setDescription("responses")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const user = interaction.member?.user.username;

  const data = await fetch(process.env.API_ENDPOINT_NEXT + "/bot/command/quotes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.BOT_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  if (data) {
    let response = data[Math.floor(Math.random() * data.length)];

    while (response.responder !== "everyone" && response.responder !== user) {
      response = data[Math.floor(Math.random() * data.length)];
    }

    const channel = client.channels.cache.get(
      interaction.channelId
    ) as TextChannel;
    if (channel) {
      channel.send(response.quote);
    }

    await interaction.reply({ content: "Sent!", ephemeral: true });
  } else {
    errorLog("No responses found");
    await interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "No responses found",
          color: 0xff0000,
        },
      ],
      ephemeral: true,
    });
  }
});
