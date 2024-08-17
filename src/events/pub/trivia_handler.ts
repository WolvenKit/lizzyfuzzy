// import type { ModalSubmitInteraction } from "discord.js";
import { event, getRandomTrivia } from "utils";

let tried = 3;

export default event(
  "interactionCreate",
  async ({ log, client }, interaction) => {
    if (!interaction.isButton()) return;

    if (
      interaction.customId === "confirmTrivia" ||
      interaction.customId === "cancelTrivia"
    ) {
      if (interaction.customId === "confirmTrivia") {
        const randomTrivia = await getRandomTrivia();

        await interaction.update({
          content: `Great! Let's start the game! First Question:\n${randomTrivia.question}`,
          components: [],
        });

        const collectorFilter = (m: any) => m.author.id === interaction.user.id;
        const collector = interaction.channel?.createMessageCollector({
          filter: collectorFilter,
          time: 30000,
        });

        collector?.on("collect", async (m) => {
          if (m.content.toLowerCase() === randomTrivia.answer.toLowerCase()) {
            await m.reply("Correct!");

            const nextTrivia = await getRandomTrivia();

            if (nextTrivia) {
              await m.reply(`Next Question:\n${nextTrivia.question}`);
            } else {
              await m.reply("No more questions! Game over!");
              collector?.stop();
            }
          } else {
            tried = tried - 1;

            if (tried > 0) {
              await m.reply("Incorrect! Try again! You have " + tried + " tries left.");
            } else {
              await m.reply(`Incorrect! The answer is ${randomTrivia.answer}`);
              collector?.stop();
            }
          }
        });

        collector?.on("end", async () => {
          await interaction.channel?.send("Time's up! Game over!");
        });
      } else {
        await interaction.update({
          content: "Maybe next time!",
          components: [],
        });
      }
    }
  }
);