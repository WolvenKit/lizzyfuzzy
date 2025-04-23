import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command, errorLog } from "utils";

const meta = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("quotes")
  .addNumberOption((option) =>
    option
      .setName("quote")
      .setDescription("Fetch a Quote by its Global ID")
      .setRequired(false)
      .setMinValue(1)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(
  meta,
  async ({ interaction }) => {
    try {
      if (interaction.options.getNumber("quote") !== null) {
        const quoteId = interaction.options.getNumber("quote");

        const data = await fetch(
          process.env.API_ENDPOINT + `/bot/quotes?quoteId=${quoteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          }
        ).then((data) => data.json());

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

        const quotes = data as {
          GlobalId: number;
          Quote: string;
          Responder: string;
        };

        const channel = interaction.channel as TextChannel;
        channel.send({
          content: quotes.Quote,
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
      } else {
        const data = await fetch(
          process.env.API_ENDPOINT +
            `/bot/quotes/request?user=${interaction.user.username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          }
        ).then((data) => data.json());

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
        };

        const channel = interaction.channel as TextChannel;

        channel.send({
          content: quotes.Quote,
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
      }
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
  },
  false,
  false
);
