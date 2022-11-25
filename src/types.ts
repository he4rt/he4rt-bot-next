import {
  APIEmbedField,
  CacheType,
  Client,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  HexColorString,
  REST,
  RestOrArray,
  SlashCommandBuilder,
  User,
} from 'discord.js'
import { ClientBuilder } from 'uncreate'

export type Maybe<T> = T | undefined | null
export type RESTJson<T extends string | number | symbol = string, K = any> = Record<T, K>
export type CommandGetOption<T extends CacheType = CacheType> = (
  interaction: CommandInteraction,
  target: string
) => CommandInteractionOption<T>

export type CommandCallback = (interaction: CommandInteraction, client: He4rtClient) => Promise<void>
export type CommandSet = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
export type Command = [CommandSet, CommandCallback]

export type He4rtClient = Client<boolean> & {
  commands: Collection<CommandSet, CommandCallback>
  api: {
    he4rt: ClientBuilder
    apoiase: ClientBuilder
  }
}

export interface RoleDefine {
  id: string
  name: string
  emoji: string
}

export interface EmbedTemplateOptions {
  title: string
  description?: string
  footer?: boolean
  delas?: boolean
  author?: User
  color?: HexColorString
  url?: string
  fields?: RestOrArray<APIEmbedField>[]
  target?: {
    user: User
    icon?: boolean
  }
}

export interface GetChannelOptions {
  id: string
  client: He4rtClient
}

export interface RankingGET extends RESTJson {
  data: RankingMember[]
}

export interface DailyPOST extends RESTJson {
  data: {
    points: number
  }
}

export interface IntroducePUT extends RESTJson {}

export interface IntroducePOST extends RESTJson {}

export interface ProfileGETBody {
  name: string
  nickname: string
  about: string
  git: string
  linkedin: string | null
}

export interface ProfileGET extends RESTJson, ProfileGETBody {
  id: number
  discord_id: string
  twitch_id: any
  email: string | null
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

export interface ProfilePUT extends ProfileGET {}

export interface MessagePOST extends RESTJson {}

export interface ApoiaseGET extends RESTJson {
  isPaidThisMonth: boolean
  isBacker: boolean
  thisMonthPaidValue?: number
}

export interface RankingMember {
  nickname?: string
  level: number
  current_exp: number
  discord_id: string
  messages_count: number
  levelup_exp: Record<any, any>
}

export interface Context {
  client: He4rtClient
  rest: REST
}
