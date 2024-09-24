import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("key")
  .setDescription("Provides information about the user keys.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("create")
      .setDescription("Create a new key")
      .addStringOption((option) =>
        option.setName("name").setDescription("Key name").setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("delete")
      .setDescription("Delete a key")
      .addStringOption((option) =>
        option
          .setName("key")
          .setDescription("The key to delete")
          .setRequired(false)
      )
      .addStringOption((option) =>
        option.setName("name").setDescription("Key name").setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("list").setDescription("List all keys")
  );

export default command(meta, async ({ interaction }) => {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "create":
      const name = interaction.options.getString("name");

      const dataCreate = await fetch(
        process.env.API_ENDPOINT_NEXT + "/bot/commands/key/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            user: interaction.user.displayName,
            id: interaction.user.id,
            name: name,
          }),
        }
      ).then((res) => res.text());

      if (!dataCreate) {
        return await interaction.reply({ content: "Error!", ephemeral: true });
      }

      return await interaction.reply({
        content: dataCreate,
        ephemeral: true,
      });
    case "delete":
      const key = interaction.options.getString("key");
      const keyName = interaction.options.getString("name");

      if (!key && !keyName) {
        return await interaction.reply({
          content: "Key or name are required!",
          ephemeral: true,
        });
      }

      const dataDelete = await fetch(
        process.env.API_ENDPOINT_NEXT + "/bot/commands/key/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            user: interaction.user.displayName,
            id: interaction.user.id,
            key: key,
            name: keyName,
          }),
        }
      );

      if (!dataDelete.ok) {
        return await interaction.reply({ content: "Error!", ephemeral: true });
      }

      return await interaction.reply({
        content: "Key deleted!",
        ephemeral: true,
      });
      break;
    case "list":
      const dataList = await fetch(
        process.env.API_ENDPOINT_NEXT + "/bot/commands/key/list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            user: interaction.user.displayName,
            id: interaction.user.id,
          }),
        }
      );

      const data = await dataList.json();

      if (!data) {
        return await interaction.reply({ content: "Error!", ephemeral: true });
      }

      if (data.length === 0) {
        return await interaction.reply({
          content: "No keys found!",
          ephemeral: true,
        });
      }

      const Keys = data.map((key: any) => {
        return `${key.name}: \`\`\`${key.key}\`\`\``;
      });

      return await interaction.reply({
        content: Keys.join("\n"),
        ephemeral: true,
      });
  }
});
