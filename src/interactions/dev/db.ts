import type { ChatInputCommandInteraction } from "discord.js";
import { Database } from "bun:sqlite";
import { MessageFlags } from "discord.js";

export default async function db(interaction: ChatInputCommandInteraction) {
  const text = interaction.options.getString("text", true);

  const db = new Database("settings.sqlite");

  const data = db.query(text).all();

  return interaction.reply({
    content: JSON.stringify(data, null, 2),
    flags: MessageFlags.Ephemeral,
  });
}
