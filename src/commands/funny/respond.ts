import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command } from "../../utils";
// import responses from '../../resources/respond.json'

const meta = new SlashCommandBuilder()
  .setName("respond")
  .setDescription("responses")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const user = interaction.member?.user.username;

  async function randomResponse() {
    const data = await fetch(
      "https://raw.githubusercontent.com/Moonded/responses/main/responses.json"
    );

    const responses = await data.json();

    return responses[Math.floor(Math.random() * responses.length)];
  }

  let response = await randomResponse();

  while (response.User !== "everyone" && response.User !== user) {
    response = randomResponse();
  }

  const channel = client.channels.cache.get(
    interaction.channelId
  ) as TextChannel;
  if (channel) {
    channel.send(response.Message);
  }

  await interaction.reply({ content: "Sent!", ephemeral: true });
});
