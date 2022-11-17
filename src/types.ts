import { Client, Collection, CommandInteraction, REST, SlashCommandBuilder } from 'discord.js'

export type CommandCallback = (interaction: CommandInteraction, client: Client) => Promise<void>
export type CommandSet = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

export type Command = [CommandSet, CommandCallback]

export type He4rtClient = Client<boolean> & {
  commands: Collection<CommandSet, CommandCallback>
}

export interface Context {
  client: He4rtClient
  rest: REST
}
