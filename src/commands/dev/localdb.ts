import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";
import { Database } from "bun:sqlite";

const meta = new SlashCommandBuilder()
    .setName("dbquery")
    .setDescription("dev")
    .addStringOption((option) =>
        option.setName("text").setDescription("text").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
    const text = interaction.options.getString("text", true);

    const db = new Database("settings.sqlite");

    const data = db.query(text).all();

    return interaction.reply({ content: JSON.stringify(data, null, 2), flags: MessageFlags.Ephemeral });
});
