import { Command, CommandCategory, CommandExec, CommandMeta } from '../types';

export function command(meta: CommandMeta, exec: CommandExec, local: boolean, dev?: boolean): Command {
  return {
    meta,
    exec,
    local,
    dev
  };
}

export function category(name: string, commands: Command[]): CommandCategory {
  return {
    name,
    commands,
  };
}
