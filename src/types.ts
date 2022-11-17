import {
  APIEmbedField,
  Client,
  Collection,
  CommandInteraction,
  HexColorString,
  REST,
  RestOrArray,
  SlashCommandBuilder,
  User,
} from 'discord.js'

export type Maybe<T> = T | undefined | null

export interface EmbedTemplateOptions {
  title: string
  author?: User
  color?: HexColorString
  url?: string
  fields?: RestOrArray<APIEmbedField>[]
  target?: {
    user: User
    icon?: boolean
  }
}

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
