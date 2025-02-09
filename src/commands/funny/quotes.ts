import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command, errorLog } from "utils";

const meta = new SlashCommandBuilder()
  .setName("quotes")
  .setDescription("quotes")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  try {
    const data = await fetch(process.env.API_ENDPOINT + "/bot/quotes/request", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
      body: JSON.stringify({
        Responder: interaction.user.username,
      }),
    })
      .then((response) => response)
      .then((res) => res.json())
      .catch((e) => {
        return interaction.reply({
          embeds: [
            {
              title: "Error",
              description: "Failed to fetch quotes",
              color: 0xff0000,
            },
          ],
          flags: 64,
        });
      });

    if (!data) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Failed to fetch quotes",
            color: 0xff0000,
          },
        ],
        flags: 64,
      });
    }

    const quotes = data[0] as {
      GlobalId: number;
      Quote: string;
      Responder: string;
    }

    const channel = interaction.channel as TextChannel;

    channel.send({
      content: quotes.Quote
    });

    return interaction.reply({
      embeds: [
        {
          title: "Success",
          description: "Quotes fetched and sent to channel",
          color: 0x00ff00,
        },
      ],
      flags: 64,
    });


  } catch (e) {
    errorLog(e);
    return interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "Failed to fetch quotes",
          color: 0xff0000,
        },
      ],
      flags: 64,
    });
  }
}, false, false);
