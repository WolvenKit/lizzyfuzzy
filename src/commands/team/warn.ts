import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Warn a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to warn").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the warning")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(
  meta,
  async ({ interaction }) => {
    try {
      const User = interaction.options.getUser("user", true);
      const Reason = interaction.options.getString("reason", false);

      const data = await fetch(process.env.API_ENDPOINT + "/moderation/warn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          Type: "Warn",
          DiscordId: User.id,
          User: User.username ?? User.globalName ?? User.displayName,
          Reason: Reason ?? null,
          Issuer: interaction.user.username,
        }),
      })
        .then((response) => response)
        .then((data) => data.json())
        .catch((error) => console.error(error));

      const member = interaction.guild?.members.cache.get(User.id);

      if (!member) {
        return interaction.reply("The user is not in the server.");
      }

      if (data) {
        return interaction.reply({
          content: `User ${User.tag} has been warned for ${Reason}.`,
          flags: 64,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  true,
  false
);
