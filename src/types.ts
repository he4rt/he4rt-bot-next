import type {
  APIEmbedField,
  CacheType,
  Client,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  ForumChannel,
  HexColorString,
  NewsChannel,
  REST,
  RestOrArray,
  SlashCommandBuilder,
  TextChannel,
  User,
  VoiceChannel,
  DMChannel,
  ThreadChannel,
  StageChannel,
  Message,
  MessageCreateOptions,
  MediaChannel,
} from 'discord.js'
import type { ClientBuilder } from 'uncreate'
import admin from 'firebase-admin'
import { Logger } from './client/logger'
import { Ticker } from './client/ticker'

export type Maybe<T> = T | undefined | null
export type RESTJson<T extends string | number | symbol = string, K = unknown> = Record<T, K>
export type Cancellable<T> = T | '__INVALID__RESPONSE__'
export type CommandGetOption<T extends CacheType = CacheType> = (
  interaction: CommandInteraction,
  target: string,
) => CommandInteractionOption<T>

export type WebhookEvent = NewsChannel | TextChannel | VoiceChannel | ForumChannel | MediaChannel

export type CommandCallback = (interaction: CommandInteraction, client: He4rtClient) => Promise<void>
export type CommandSet = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
export type Command = [CommandSet, CommandCallback]

export type TickerCallback = () => void | Promise<void>
export type TickerItem = [TickerName, TickerCallback]
export enum TickerName {
  Pomodoro = 'COWORKING_POMODORO',
  DiscordPresence = 'DISCORD_PRESENCE',
  VoiceXP = 'VOICE_XP',
  DynamicVoice = 'DYNAMIC_VOICE',
}

export type He4rtClient = Client<boolean> & {
  commands: Collection<CommandSet, CommandCallback>
  ticker: Ticker
  logger: Logger
  firestore: admin.firestore.Firestore
  api: {
    he4rt: ClientBuilder
    apoiase: ClientBuilder
  }
}

export interface LoggerEmitOptions {
  message: string
  type: 'bot' | 'http' | 'apoiase' | 'command' | 'event' | 'role' | 'discord' | 'he4rt-api' | 'ticket'
  color: 'success' | 'info' | 'warning' | 'error'
  user?: User
  customChannelId?: string
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

export interface RankingGET {
  data: Array<{
    user?: {
      username: string
    }
    ranking: number
    level: number
    experience: number
  }>
}

export interface DailyPOST {
  points: number
  date: string
}

export type IntroducePUT = RESTJson

export type IntroducePOST = RESTJson

export interface BadgePOST {
  name: string
  description: string
  image_url: string
  redeem_code: string
  active: number
}

export interface UserGETBody {
  info: {
    name: string
    nickname: string
    about: string
    github_url: string
    linkedin_url: string | null
    birthdate: string
  }
  address: {
    state: string | null
  }
}

export interface UserLevelXP {
  levelup_exp: {
    id: number
    required: number
    created_at: string | null
    updated_at: string | null
  }
}

export interface UserGET extends UserGETBody, UserLevelXP {
  information: {
    name: string
    nickname: string
    about: string
    github_url: string
    linkedin_url: string | null
  }
  character: {
    level: number
    experience: number
  }
}

export type UserPUT = UserGET

export type MessagePOST = RESTJson

export type VoicePOST = RESTJson

export interface ApoiaseGET {
  isPaidThisMonth: boolean
  isBacker: boolean
  thisMonthPaidValue?: number
}

export interface MeetingPATCH {
  id: number
  content: string
  meeting_type_id: number
  admin_id: number
  starts_at: string | null
  ends_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface MeetingEndPOST {
  message: string
}

export interface MeetingPOST {
  meeting_type_id: number
  starts_at: string | null
  admin_id: number
  updated_at: string | null
  created_at: string | null
  id: number
}

export interface MeetingAttendPost {
  message: string
}

export interface FeedbackCreatePOST {
  sender_id: number
  target_id: number
  message: string
  type: string
  updated_at: string | null
  created_at: string | null
  id: number
}

export interface FeedbackReviewPOST {
  message: string
}

export interface RankingMember extends UserLevelXP {
  nickname?: string
  level: number
  current_exp: number
  discord_id: string
  messages_count: number
}

export interface Context {
  client: He4rtClient
  rest: REST
}

export interface FirestoreUser {
  id: string
  donator_email?: string
  donator_value?: number
  daily?: number
  daily_last?: string
  nitro?: boolean
  join_space?: number
  reputation?: number
  time_voice?: number
}

export interface FirestoreMedal {
  name: string
  description: string
  role_id: string
  users_id: string[]
}

export interface FirestoreMedalUser {
  id: string
  expires_at: string
}

// Type for channels that support the send() method
export type SendableChannel = DMChannel | TextChannel | NewsChannel | VoiceChannel | StageChannel
