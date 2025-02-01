import { errorLog, event } from "utils";
import { Database } from "bun:sqlite";
import { Colors, EmbedType, MessageFlags } from "discord.js";

export default event("interactionCreate", async ({ log, client }, interaction) => {
    try {

        if (!interaction.isButton()) return;

        const button = interaction.customId.split("_")

        if (button[0] === "pirate") {

            const db = new Database("settings.sqlite");

            if (button[1] === "mark") {
                interaction.guild?.members.fetch(button[2]).then(member => {
                    member.roles.add("1335271939513516135")


                    return interaction.message.edit({ components: [] })
                })

                return interaction.message.edit({ components: [] })
            }
            if (button[1] === "ignore") {
                db.query(`DELETE FROM markedMembers WHERE user = '${button[2]}'`).run();
                interaction.reply({ content: "Successfully Ignored Marked member!\nMarked member: <@" + button[2] + ">", flags: MessageFlags.Ephemeral })

                return interaction.message.edit({ components: [] })
            }
        }

    } catch (error) {
        errorLog(error);
    }
}
);
// Compare this snippet from src/utils/index.ts:    