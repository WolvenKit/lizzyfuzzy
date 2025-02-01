import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

type LoggerFunction = (...args: any[]) => void;

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  log: LoggerFunction;
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | ContextMenuCommandBuilder
  | UserContextMenuCommandInteraction

export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
}

export interface CommandCategory {
  name: string;
  commands: Command[];
}
