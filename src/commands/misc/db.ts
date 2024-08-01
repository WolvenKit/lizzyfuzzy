import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";
import { prisma } from "src";

const meta = new SlashCommandBuilder()
  .setName("db")
  .setDescription("db tester")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const db = JSON.stringify(await prisma.user.findMany());

  interaction.reply({
    content: db,
    ephemeral: true,
  });
});
