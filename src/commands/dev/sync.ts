import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command, errorLog } from "utils";

const meta = new SlashCommandBuilder()
  .setName("sync")
  .setDescription("Sync External Data with the API")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const data = await fetch(
    process.env.API_ENDPOINT_NEXT + "/bot/commands/core-versions/update",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  if (data) {
    return await interaction.reply({
      content: "Syncing data...",
      flags: 64,
    });
  } else {
    errorLog("No data found", "sync.ts", "sync");
    return await interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "No data found",
          color: 0xff0000,
        },
      ],
      flags: 64,
    });
  }
}, true, false);
