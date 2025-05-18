import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { command } from "utils";
import { Database } from "bun:sqlite";

const meta = new SlashCommandBuilder()
  .setName("clean")
  .setDescription(
    "Clean a Users Marked Status fromt the Database and Removed the role."
  )
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to mark as a Pirate")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export default command(
  meta,
  async ({ interaction }) => {
    if (!interaction.guild) return;
    if (interaction.user.bot) return;
    if (!interaction.isContextMenuCommand) return;

    const User = interaction.options.getUser("user", true);

    const db = new Database("settings.sqlite");

    const getUser = db
      .query(`SELECT * FROM markedMembers WHERE user = '${User.id}'`)
      .get();

    if (!getUser) {
      

      const setting_markedRole = db
        .query(
          `SELECT value FROM settings WHERE key = 'setting_markedMemberRole'`
        )
        .get() as { value: string };

      const role = interaction.guild.roles.cache.get(setting_markedRole.value);

      if (!role) {
        db.close();
        return interaction.reply({
          content: `The Marked Role is not set up yet.`,
          flags: 64,
        });
      }

      const guildMember = interaction.guild.members.cache.get(User.id);

      if (!guildMember) {
        db.close();
        return interaction.reply({
          content: `User is not in the server.`,
          flags: 64,
        });
      }

      guildMember.roles.remove(role);

      db.close();

      return interaction.reply({
        content: `User is not marked as a Pirate in the Database.\nTrying to remove role.`,
        flags: 64,
      });
    }

    const guildMember = interaction.guild.members.cache.get(User.id);

    if (!guildMember) {
      db.close();
      return interaction.reply({
        content: `User is not in the server.`,
        flags: 64,
      });
    }

    const setting_markedRole = db
      .query(
        `SELECT value FROM settings WHERE key = 'setting_markedMemberRole'`
      )
      .get() as { value: string };

    const role = interaction.guild.roles.cache.get(setting_markedRole.value);

    if (!role) {
      db.close();
      return interaction.reply({
        content: `The Marked Role is not set up yet.`,
        flags: 64,
      });
    }

    guildMember.roles.remove(role);

    db.query(`DELETE FROM markedMembers WHERE user = '${User.id}'`).run();
    db.close();

    interaction.reply({
      content: `User ${User.tag} has been cleared from the database.`,
      flags: 64,
    });
  }
);
