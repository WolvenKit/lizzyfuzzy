import type { ModalSubmitInteraction } from "discord.js";
import { event } from "utils";

export default event(
  "interactionCreate",
  async ({ log, client }, interaction) => {
    if (interaction.isModalSubmit() && interaction.customId === "suggestion") {
      const modal = interaction as ModalSubmitInteraction;
      const suggestion_text = modal.fields.getTextInputValue("suggestion_text");

      log(suggestion_text);

      await modal.reply({
        content: "Thank you for your suggestion!",
        ephemeral: true,
      });
    }
  }
);