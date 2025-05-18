import { ChatInputCommandInteraction } from "discord.js";
import commands from "src/interactions";
import { Command } from "types";
import { EditReply, event, Reply, log as LOGGING, errorLog } from "utils";

const allCommands = commands;
const allCommandsMap = new Map<string, Command>(
  allCommands.map((c) => [c.meta.name, c])
);

export default event(
  "interactionCreate",
  async ({ log, client }, Interaction) => {
    try {
      if (!Interaction.isCommand()) return;

      let interaction = Interaction;
      interaction = interaction as ChatInputCommandInteraction;

      try {
        const commandName = interaction.commandName;
        const command = allCommandsMap.get(commandName);

        if (!command) throw new Error("Command not found");

        await command.exec({
          client,
          interaction,
          log(...args) {
            log(...args);
          },
        });

        LOGGING(`Command "${command.meta.name}" executed`);
      } catch (error) {
        errorLog("[Command Error]", error);

        if (interaction.deferred)
          return interaction.editReply(EditReply.error("Something went wrong"));

        return interaction.reply(Reply.error("Something went wrong"));
      }
    } catch (error) {
      errorLog("[Event Error]", error);
    }
  }
);
