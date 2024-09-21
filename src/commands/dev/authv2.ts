import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("authnext")
  .setDescription("dev");

export default command(meta, async ({ interaction }) => {
  const body = {
    username: interaction.user.username,
    connections: [
      {
        service: "discord",
        username: interaction.user.username,
        serviceid: interaction.user.id,
      },
    ],
  };

  const data = await fetch(process.env.API_ENDPOINT_NEXT + "/dev/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const returned = await data.json();

  if (!returned) {
    return await interaction.reply({ content: "Error!", ephemeral: true });
  }

  return await interaction.reply({ content: "Authed!", ephemeral: true });
});
