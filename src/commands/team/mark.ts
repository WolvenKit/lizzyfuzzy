import { Colors, SlashCommandBuilder, TextChannel } from "discord.js";
import { command } from "utils";
import { Database } from "bun:sqlite"

const meta = new SlashCommandBuilder()
    .setName("mark")
    .setDescription("Mark a user as a Pirate for the moderation team to veryify")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to mark as a Pirate")
        .setRequired(true)
    ).addStringOption(option => option
        .setName("message")
        .setDescription("URL to the message that indicated the user is a Pirate")
        .setRequired(false)
    );




export default command(meta, async ({ interaction }) => {
    if (!interaction.guild) return;
    if (interaction.user.bot) return;
    if (!interaction.isContextMenuCommand) return;

    const User = interaction.options.getUser("user", true)
    const Message = interaction.options.getString("message", false);

    const db = new Database("settings.sqlite");

    const moderationCategory = db.query(`SELECT value FROM settings WHERE key = 'markedMembersChannel'`).get() as { value: string };

    const channel = interaction.guild.channels.cache.get(moderationCategory.value) as TextChannel;

    if (!channel) {
        return interaction.reply("The Marked Members Channel is not set up yet.");
    }

    const message = await channel.send({
        embeds: [
            {
                title: "Pirate Marked",
                fields: [
                    {
                        name: "User",
                        value: User.toString(),
                        inline: true
                    },
                    {
                        name: "Marker",
                        value: interaction.user.toString(),
                        inline: true
                    },
                    {
                        name: "Message Link",
                        value: Message || "No Message Link Provided"
                    }
                ],
                color: Colors.Red
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 4,
                        label: "Mark",
                        custom_id: `pirate_mark_${User.id}`
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Ignore",
                        custom_id: `pirate_ignore_${User.id}`
                    }
                ]
            }
        ]
    });

    db.run(`INSERT INTO markedMembers (user, message, channel, messageid) VALUES (?, ?, ?, ?)`, [User.id, Message, channel.id, message.id]);

    return interaction.reply({
        content: `User has been marked as a Pirate.`,
        ephemeral: true
    });
});
