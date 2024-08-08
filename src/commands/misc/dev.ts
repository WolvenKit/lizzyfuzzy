import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { prisma, command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("dev")
  .setDescription("dev command")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to show information about")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const user = interaction.options.getUser("user");

  const userData = await prisma.user.findUnique({
    where: {
      userid: user?.id,
    },
  });

  if (!userData) {
    return interaction.reply({
      content: "User not found",
      ephemeral: true,
    });
  } else {
    return interaction.reply({
      content: `User: ${userData.user}\nNexusMods: ${userData.nexusmods}\nGitHub: ${userData.github}\nTheme: ${userData.theme}\nDescription: ${userData.description}`,
      ephemeral: true,
    });
  }
});
