import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

import client from "prom-client";

const gauge = new client.Counter({
  name: "command_init_usage",
  help: "Usage of the info command",
});

const meta = new SlashCommandBuilder()
  .setName("init")
  .setDescription("dev command")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  gauge.inc(1);
  const Welcome =
    "Hey, hey, hey, choombas! Lizzy Wizzy here, shimmering and shining just for you. I'm your brand-new modding bot, live and ready to rock the net! Whether you're rewriting reality or just adding a bit more chrome, I'm your backstage pass to the future. Let's break the boundaries of Night City, together. Remember, in this electrifying maze, your imagination is the ultimate power. Now, show me your brilliance. Stay golden, stay wild, and keep it real. Happy modding, my digital dreamers!";
  interaction.channel?.send(Welcome);
  interaction.reply({ content: "Send Message", ephemeral: true });
});
