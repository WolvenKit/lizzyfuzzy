import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("pass")
  .setDescription("Authticate with the API for an API key")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("create")
      .setDescription("Create data for the Database!")

      .addStringOption((option) =>
        option.setName("password").setDescription("Password").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("username").setDescription("Username").setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("key")
      .setDescription("Get your API Key!")
      .addStringOption((option) =>
        option.setName("password").setDescription("Password").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("update")
      .setDescription("Update your API Key!")
      .addStringOption((option) =>
        option.setName("password").setDescription("Password").setRequired(true)
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const subcommand = interaction.options.getSubcommand();
  let password = interaction.options.getString("password");
  let username = interaction.options.getString("username");

  switch (subcommand) {
    case "create":
      if (!password) {
        await interaction.reply("Password is required!");
        return;
      }

      if (!username) {
        username = interaction.user.username;
      }

      const data = await fetch(
        process.env.API_ENDPOINT + "/bot/team/pass/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            password,
            username,
            discord: interaction.user.id,
          }),
        }
      )
        .then((res) => res.text())
        .then((data) => {
          return data;
        });

      if (data === "User already exists") {
        await interaction.reply({
          content: "User already exists!",
          ephemeral: true,
        });
        return;
      }

      if (data) {
        await interaction.reply({
          content:
            "Data created! Use </pass key:1277638897966514211> to get your API Key",
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
      break;
    case "key":
      if (!password) {
        await interaction.reply("Password is required!");
        return;
      }

      const key = await fetch(process.env.API_ENDPOINT + "/bot/team/pass/key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify({
          password,
          discord: interaction.user.id,
        }),
      })
        .then((res) => res.text())
        .then((data) => {
          return data;
        });

      if (key) {
        await interaction.reply({
          content: `API Key: ${key}`,
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
      break;

    case "update":
      if (!password) {
        await interaction.reply("Password is required!");
        return;
      }



      const update = await fetch(
        process.env.API_ENDPOINT + "/bot/team/pass/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            password,
            discord: interaction.user.id,
          }),
        }
      )
        .then((res) => res.text())
        .then((data) => {
          return data;
        });

      if (update) {
        await interaction.reply({
          content: "API Key updated!",
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
      break;
  }
});
