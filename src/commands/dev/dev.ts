import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("dev")
  .setDescription("dev command")
  .addStringOption((option) =>
    option
      .setName("user")
      .setDescription("The user to show information about")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getString("user");

  if (user) {
    const userData = await fetch(
      process.env.API_ENDPOINT + "/bot/dev/users?q=" + user.toLowerCase(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    if (!userData) {
      return interaction.reply({
        content: "User not found",
        flags: 64,
      });
    } else {
      return interaction.reply({
        content: `User: ${userData.user}\nNexusMods: ${userData.nexusmods}\nGitHub: ${userData.github}\nTheme: ${userData.theme}\nDescription: ${userData.description}`,
        flags: 64,
      });
    }
  } else {
    const Users = await fetch(process.env.API_ENDPOINT_NEXT + "/bot/dev/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    if (Users.length === 0) {
      return interaction.reply({
        content: "No users found",
        flags: 64,
      });
    }

    return interaction.reply({
      content: Users.map((user: any) => {
        return `User: ${user.user}\ID: ${user.id}`;
      }),
      flags: 64,
    });
  }
});
