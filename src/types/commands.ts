import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
} from "discord.js";

type LoggerFunction = (...args: any[]) => void;

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  log: LoggerFunction;
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | ContextMenuCommandBuilder;

export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
}

export interface CommandCategory {
  name: string;
  commands: Command[];
}
