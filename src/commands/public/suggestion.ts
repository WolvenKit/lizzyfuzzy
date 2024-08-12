import {
  SlashCommandBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("suggestions")
  .setDescription("Suggest features for the bot. Abusing users will be banned.")
  .addSubcommand((subcommand) =>
    subcommand.setName("create").setDescription("Create a suggestion")
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  if (interaction.options.getSubcommand() === "create") {
    const modal = new ModalBuilder()
      .setTitle("Suggestion")
      .setCustomId("suggestion");

    const textfield = new TextInputBuilder()
      .setCustomId("suggestion_text")
      .setPlaceholder("Suggestion...")
      .setRequired(true)
      .setLabel("Suggestion")
      .setStyle(TextInputStyle.Paragraph);

    const actionrow: ActionRowBuilder<TextInputBuilder>[] = [
      new ActionRowBuilder<TextInputBuilder>().addComponents(textfield),
    ];

    modal.addComponents(actionrow);

    await interaction.showModal(modal);
  }

    
});
