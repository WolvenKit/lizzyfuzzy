import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command, prisma } from "utils";

const meta = new SlashCommandBuilder()
  .setName("respond")
  .setDescription("responses")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const user = interaction.member?.user.username;

  const data = await prisma.quotes.findMany();

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
});
