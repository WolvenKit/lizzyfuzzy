import { SlashCommandBuilder, TextBasedChannel, TextChannel, User } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("reminder")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to remind you about")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("time")
      .setDescription("The time in minutes to remind you")
      .setRequired(true)
  )
  .setDescription("Reminder Function, works if the bot is online and hasn't restarted/crashed");

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString("message", true);
  const time = interaction.options.getNumber("time", true);
  const channel = interaction.channel as TextChannel;
  const author = interaction.user as User;

  if (message.length > 1000) {
    return interaction.reply({ content: "Message must be less than 1000 characters", ephemeral: true });
  }

  if (!message) {
    return interaction.reply({ content: "No message provided", ephemeral: true });
  }

  setTimeout(() => {
    channel.send({ content: `${author}\nReminder: ${message}` });
  }, time * 60000);

  return interaction.reply({ content: `Reminder set for ${time} minutes`, ephemeral: true });
}, true, false);
