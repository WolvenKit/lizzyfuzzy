import { errorLog, event } from "utils";
import { Database } from "bun:sqlite";
import { Role, MessageFlags } from "discord.js";

export default event(
  "interactionCreate",
  async ({ log, client }, interaction) => {
    try {
      if (!interaction.isButton()) return;

      const button = interaction.customId.split("_");

      if (button[0] === "pirate") {
        const db = new Database("settings.sqlite");

        if (button[1] === "mark") {
          interaction.guild?.members.fetch(button[2]).then((member) => {
            const role = db
              .query(
                `SELECT value FROM settings WHERE key = 'setting_markedMemberRole'`
              )
              .get() as { value: string };

            const ValuateRole = interaction.guild?.roles.cache.get(
              role.value
            ) as Role;

            member.roles.add(ValuateRole);

            return interaction.message.edit({ components: [] });
          });

          return interaction.message.edit({ components: [] });
        }
        if (button[1] === "ignore") {
          db.query(
            `DELETE FROM markedMembers WHERE user = '${button[2]}'`
          ).run();
          interaction.reply({
            content:
              "Successfully Ignored Marked member!\nMarked member: <@" +
              button[2] +
              ">",
            flags: MessageFlags.Ephemeral,
          });

          return interaction.message.edit({ components: [] });
        }
      }
    } catch (error) {
      errorLog(error);
    }
  }
);
// Compare this snippet from src/utils/index.ts:
