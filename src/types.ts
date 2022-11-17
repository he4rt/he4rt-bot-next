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
import { $Fetch } from 'ofetch'

export type Maybe<T> = T | undefined | null

export interface EmbedTemplateOptions {
  title: string
  footer?: boolean
  author?: User
  color?: HexColorString
  url?: string
  fields?: RestOrArray<APIEmbedField>[]
  target?: {
    user: User
    icon?: boolean
  }
}

export interface RankingGET extends Record<any, any> {
  data: RankingMember[]
}

export interface DailyGET extends Record<any, any> {
  data: {
    points: number
  }
}

export interface RankingMember {
  nickname?: string
  level: number
  current_exp: number
  discord_id: string
  messages_count: number
  levelup_exp: Record<any, any>
}

export type CommandCallback = (interaction: CommandInteraction, client: He4rtClient) => Promise<void>
export type CommandSet = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

export type Command = [CommandSet, CommandCallback]

export type He4rtClient = Client<boolean> & {
  commands: Collection<CommandSet, CommandCallback>
}

export interface Context {
  client: He4rtClient
  rest: REST
}
