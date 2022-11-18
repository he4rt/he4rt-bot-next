import {
  APIEmbedField,
  Client,
  Collection,
  CommandInteraction,
  HexColorString,
  REST,
  RestOrArray,
  SlashCommandBuilder,
  TextBasedChannel,
  User,
} from 'discord.js'

export type Maybe<T> = T | undefined | null

export interface EmbedTemplateOptions {
  title: string
  description?: string
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

export interface DailyPOST extends Record<any, any> {
  data: {
    points: number
  }
}

export interface IntroducePUT extends Record<any, any> {}

export interface IntroducePOST extends Record<any, any> {}

export interface ProfileGET extends Record<string, any> {
  id: number
  discord_id: string
  twitch_id: any
  email: string | null
  name: string
  nickname: string
  git: string
  about: string
  level: number
  current_exp: number
  money: string
  daily: string | null
  created_at: string | null
  updated_at: string | null
  levelup_exp: {
    id: number
    required: number
    created_at: string | null
    updated_at: string | null
  }
}

export interface GamificationPOST extends Record<string, any> {}

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
