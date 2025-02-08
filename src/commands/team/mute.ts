import {  PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Custom timeout command for more precision")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true)
    ).addNumberOption(option => option
        .setName("time")
        .setDescription("The time in minutes to timeout the user")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)



export default command(meta, async ({ interaction }) => {
    if (!interaction.guild) return;
    if (interaction.user.bot) return;
    if (!interaction.isContextMenuCommand) return;

    const User = interaction.options.getUser("user", true)

    const member = interaction.guild.members.cache.get(User.id);

    if (!member) {
        return interaction.reply("The user is not in the server.");
    }

    member.timeout(interaction.options.getNumber("time", true) * 60000, "Custom Timeout");

    interaction.reply({
        content: `User ${User.tag} has been timed out for ${interaction.options.getNumber("time", true)} minute(s).`,
        ephemeral: true
    });
});
