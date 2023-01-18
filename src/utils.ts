import {
  ButtonInteraction,
  CategoryChannel,
  CommandInteraction,
  CommandInteractionOption,
  DMChannel,
  EmbedBuilder,
  ForumChannel,
  Guild,
  GuildMember,
  HexColorString,
  Message,
  PartialGuildMember,
  PermissionFlagsBits,
  TextBasedChannel,
  User,
} from 'discord.js'
import { CLIENT_NAME, CLIENT_TIMEZONE, COLORS, HE4RT_DELAS_ICON_1_URL, HE4RT_ICON_1_URL } from '@/defines/values.json'
import {
  VOLUNTEER_ROLE,
  PRESENTING_ROLE,
  PRESENTED_ROLE,
  DONATOR_ROLE,
  NITRO_BOOSTER_ROLE,
  HE4RT_DELAS_ROLE,
  ATA_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
  FORUM_CHANNEL,
  DYNAMIC_CATEGORY_CHANNEL,
  HE4RTLESS_ROLE,
  HE4RT_ROLE,
  SUPREME_ROLE,
  ADVANCED_ROLE,
  INTERMEDIATE_ROLE,
  BEGINNER_ROLE,
} from '@/defines/ids.json'
import {
  SUCCESS_COMMAND_DEFAULT,
  SUCCESS_DM_SEND,
  EXECUTING,
  ERROR_DEFAULT,
  ERROR_INVALID_EMAIL,
  ERROR_MISS_PERMISSION,
  ERROR_MEMBER_IS_NOT_PRESENTED,
  ERROR_ACCESS_DM,
  ERROR_INVALID_ARGUMENT,
  ERROR_CHANNEL_PERMISSION,
  ERROR_CANNOT_BE_BANNED,
  ERROR_PAGINATION,
  ERROR_PRESENTING,
} from '-/defaults/reply.json'
import { NOT_FOUND, LANGUAGE_NONE } from '-/defaults/display.json'
import { TIMEOUT_COMMAND_STRING, DEFINE_STRING_REPLACED } from '@/defines/values.json'
import { CommandGetOption, EmbedTemplateOptions, GetChannelOptions, He4rtClient } from '@/types'
import pkg from '../package.json'

export const validDisplayDevRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_DEV_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(' ') || LANGUAGE_NONE
  )
}

export const validDisplayEngRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_ENG_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(' ') || LANGUAGE_NONE
  )
}

export const validDisplaySpecialRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) =>
        [HE4RTLESS_ROLE, HE4RT_ROLE, SUPREME_ROLE, ADVANCED_ROLE, INTERMEDIATE_ROLE, BEGINNER_ROLE].some(
          (v) => v.id === role.id
        )
      )
      .map((role) => `<@&${role.id}>`)
      .join(' ') || LANGUAGE_NONE
  )
}

export const isPresentedMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === PRESENTED_ROLE.id)
}

export const isPresentingMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === PRESENTING_ROLE.id)
}

export const isPrivilegedMember = (member: GuildMember) => {
  return isApoiaseMember(member) || isNitroBoosterMember(member)
}

export const isApoiaseMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === DONATOR_ROLE.id)
}

export const isNitroBoosterMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === NITRO_BOOSTER_ROLE.id)
}

export const isHe4rtDelasMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === HE4RT_DELAS_ROLE.id)
}

export const isATAMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === ATA_ROLE.id)
}

export const isVoluntaryMember = (member: GuildMember) => {
  return member.roles.cache.some(({ id }) => id === VOLUNTEER_ROLE.id)
}

export const isBot = (author: User): boolean => {
  return !!author?.bot
}

export const isAdministrator = (member: GuildMember) => {
  return member.permissions.has(PermissionFlagsBits.Administrator, true)
}

export const isValidMessage = (message: Message) => {
  return (
    !isBot(message.author) && message.content && message.member && message.inGuild && message?.id && message?.author?.id
  )
}

export const isValidId = (id: number, arr: any[]) => {
  return !isNaN(id) && id <= arr.length && id > 0
}

export const isCustomColorRole = (name: string) => {
  return /.+#\d{4}/i.test(name)
}

export const isCancellable = (str: string) => {
  return str === TIMEOUT_COMMAND_STRING
}

export const hasRole = (member: GuildMember, target: string) => {
  return member.roles.cache.some(({ id }) => id === target)
}

export const normalizeStringData = (str: string) => {
  return str !== TIMEOUT_COMMAND_STRING ? str : NOT_FOUND
}

export const embedTemplate = (options: EmbedTemplateOptions) => {
  const embed = new EmbedBuilder()
    .setColor(
      options.color || (options.delas ? (COLORS.HE4RT_DELAS as HexColorString) : (COLORS.HE4RT as HexColorString))
    )
    .setTitle(options.title)

  if (options.description) embed.setDescription(options.description)
  if (options.target?.icon) embed.setThumbnail(getUserAvatar(options.target.user))
  if (options.url) embed.setURL(options.url)
  if (options.author?.avatar) embed.setAuthor({ name: options.author.username, iconURL: getUserAvatar(options.author) })

  options.fields?.forEach((f) => {
    embed.addFields(...f)
  })

  if (options.footer === undefined || options.footer) {
    embed
      .setFooter({
        text: `${new Date().getFullYear()} © ${CLIENT_NAME}`,
        iconURL: options.delas ? HE4RT_DELAS_ICON_1_URL : HE4RT_ICON_1_URL,
      })
      .setTimestamp()
  }

  return embed
}

export const getUserAvatar = (author: User) => {
  return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=256`
}

export const getGuild = ({ guilds }: He4rtClient): Guild => {
  return guilds.cache.get(process.env.DISCORD_GUILD_ID)
}

export const getChannel = ({ client, id }: GetChannelOptions) => {
  return client.channels.cache.get(id) as TextBasedChannel
}

export const getForumChannel = (client: He4rtClient) => {
  return client.channels.cache.get(FORUM_CHANNEL.id) as ForumChannel
}

export const getDynamicVoiceCategory = (client: He4rtClient) => {
  return client.channels.cache.get(DYNAMIC_CATEGORY_CHANNEL.id) as CategoryChannel
}

export const getOption: CommandGetOption = (interaction: CommandInteraction, target: string) => {
  return interaction.options.get(target) as CommandInteractionOption
}

export const getCustomColorRole = ({ roles }: GuildMember | PartialGuildMember) => {
  return roles.cache.find((x) => isCustomColorRole(x.name)) || false
}

export const getTaggedMembers = (ids: string[]): string => {
  return ids.map((id) => `<@${id}>`).join(' ') || ''
}

export const getTargetMember = (member: GuildMember): string => {
  return `**${member.id || 0} - ${member.user?.username || 'Indefinido'}**`
}

export const getBotVersion = (): string => {
  return `v${pkg.version}`
}

export const replaceDefineString = (str: string, target: string) => {
  return str.replaceAll(DEFINE_STRING_REPLACED, target)
}

export const sendInDM = async (dm: DMChannel, interaction: CommandInteraction | ButtonInteraction, str: string) => {
  await dm.send(str).catch(async () => {
    await reply(interaction).errorInAccessDM()

    return false
  })

  return true
}

export const reply = (interaction: CommandInteraction | ButtonInteraction) => {
  const success = async () => {
    await interaction.reply({ content: SUCCESS_COMMAND_DEFAULT, ephemeral: true }).catch(() => {})
  }

  const successInAccessDM = async () => {
    await interaction.reply({ content: SUCCESS_DM_SEND, ephemeral: true }).catch(() => {})
  }

  const executing = async () => {
    await interaction.reply({ content: EXECUTING, ephemeral: true }).catch(() => {})
  }

  const error = async () => {
    return await interaction.reply({
      content: ERROR_DEFAULT,
      ephemeral: true,
    })
  }

  const errorInvalidEmail = async () => {
    return await interaction.reply({
      content: ERROR_INVALID_EMAIL,
      ephemeral: true,
    })
  }

  const errorPermission = async () => {
    return await interaction.reply({ content: ERROR_MISS_PERMISSION, ephemeral: true })
  }

  const errorMemberIsNotPresented = async () => {
    return await interaction.reply({ content: ERROR_MEMBER_IS_NOT_PRESENTED, ephemeral: true })
  }

  const errorInAccessDM = async () => {
    await interaction.reply({ content: ERROR_ACCESS_DM, ephemeral: true })
  }

  const errorInMissingArgument = async () => {
    await interaction.reply({ content: ERROR_INVALID_ARGUMENT, ephemeral: true })
  }

  const errorUserCannotBeBaned = async () => {
    await interaction.reply({ content: ERROR_CANNOT_BE_BANNED, ephemeral: true })
  }

  const errorSpecificChannel = async (str: string) => {
    await interaction.reply({ content: `${ERROR_CHANNEL_PERMISSION}${str}!`, ephemeral: true })
  }

  const errorPaginationFail = async () => {
    await interaction.reply({ content: ERROR_PAGINATION, ephemeral: true })
  }

  const errorPresentingFail = async () => {
    await interaction.reply({ content: ERROR_PRESENTING, ephemeral: true })
  }

  return {
    success,
    successInAccessDM,
    executing,
    error,
    errorInvalidEmail,
    errorPermission,
    errorMemberIsNotPresented,
    errorInAccessDM,
    errorInMissingArgument,
    errorUserCannotBeBaned,
    errorSpecificChannel,
    errorPaginationFail,
    errorPresentingFail,
  }
}

export const isImageHTTPUrl = (url: string) => {
  return url.match(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gim)
}

export const isHex = (str: string) => {
  return str.match(/^#[0-9A-F]{6}$/i)
}

export const isValidProxyContent = (str: string) => {
  return ['https://tenor.com', 'https://forms.gle'].some((v) => str.trim().startsWith(v))
}

export const js = () => {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const getUTCDate = () => {
    const date = new Date()
    date.toLocaleString('pt-BR', {
      timeZone: CLIENT_TIMEZONE,
    })

    return date
  }

  const getFullTime = (): string => {
    const date = getUTCDate()

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  const getTime = (): string => {
    const date = getUTCDate()

    return `${date.getHours()}:${date.getMinutes()}`
  }

  const randomHex = (): HexColorString => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  return { sleep, getUTCDate, getFullTime, getTime, randomHex }
}
