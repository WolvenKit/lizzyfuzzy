import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "utils";

import { user, component, db, server } from "./dev";

const meta = new SlashCommandBuilder()
  .setName("dev")
  .setDescription("dev command")
  .addSubcommand((user) =>
    user
      .setName("user")
      .setDescription("Show information about a user")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the user to show information about")
          .setRequired(false)
      )
  )
  .addSubcommand((component) =>
    component
      .setName("component")
      .setDescription("Show information about a component")
  )
  .addSubcommandGroup((db) =>
    db
      .setName("db")
      .setDescription("Database Commands for LocalDB")
      .addSubcommand((query) =>
        query
          .setName("query")
          .setDescription("Query the database")
          .addStringOption((option) =>
            option
              .setName("string")
              .setDescription("The query to run")
              .setRequired(true)
          )
      )
  )
  .addSubcommand((servers) =>
    servers
      .setName("server")
      .setDescription("Show information about the servers")
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  if (interaction.user.bot) return;

  if (!process.env.CREATOR) {
    return interaction.reply({
      content:
        "Somehow, you got access to this command, but you shouldn't have. Please contact <@220278978898821121> for more information.",
      flags: MessageFlags.Ephemeral,
    });
  }

  switch (interaction.options.getSubcommand()) {
    case "user":
      return user(interaction);
    case "component":
      return component(interaction);
    case "db":
      return db(interaction);
    case "server":
      return server(interaction, client);
  }
});
