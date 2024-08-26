import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("update")
  .setDescription("Manuel database Update!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const data = await fetch(
    process.env.API_ENDPOINT + "/bot/commands/core-versions/update",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
    }
  );

  if (data) {
    await interaction.reply({
      content: "Data updated!",
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "No data found",
          color: 0xff0000,
        },
      ],
      ephemeral: true,
    });
  }
});
