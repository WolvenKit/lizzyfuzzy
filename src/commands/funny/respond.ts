import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("respond")
  .setDescription("responses")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const responses = [
    { Message: "The fuck you want?", User: "everyone" },
    { Message: "I am here to serve you, creator", User: "moonded" },
    { Message: "I am V", User: "projectv" },
    { Message: "the bin in the bin", User: "everyone" },
    {
      Message: "If I catch zhin outside again, i swear to...",
      User: "moonded",
    },
    {
      Message: "It looks like you pirated the game - clippy",
      User: "everyone",
    },
    {
      Message:
        "I ain't reading all that. I'm happy for u tho. Or sorry that happend",
      User: "everyone",
    },
    {
      Message: "Have you tried turning it on and off again?",
      User: "everyone",
    },
    { Message: "50$ steam gift card bro", User: "everyone" },
    { Message: "Reading is hard.", User: "everyone" },
    { Message: "EVERYONE", User: "everyone" },
  ];

  const user = interaction.member?.user.username;

  function randomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  let response = randomResponse();

  while (response.User !== "everyone" && response.User !== user) {
    response = randomResponse();
  }

  client.channels.cache.get(interaction.channelId)?.send(response.Message);

  await interaction.reply({ content: "Sent!", ephemeral: true });
});
