import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("trivia")
  .setDescription("Trivia")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const confirmButton = new ButtonBuilder()
    .setCustomId("confirmTrivia")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Primary);
  const cancelButton = new ButtonBuilder()
    .setCustomId("cancelTrivia")
    .setLabel("No")
    .setStyle(ButtonStyle.Danger);

  const initalActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    confirmButton,
    cancelButton
  );

  await interaction.reply({
    content: "Do you want to play trivia?",
    components: [initalActionRow],
  });
});
