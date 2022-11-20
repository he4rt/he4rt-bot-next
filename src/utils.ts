import {
  CommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
  GuildMember,
  HexColorString,
  Message,
  PermissionFlagsBits,
  TextBasedChannel,
  User,
} from 'discord.js'
import { CLIENT_NAME, COLORS, HE4RT_DELAS_ICON_1_URL, HE4RT_ICON_1_URL } from '@/defines/values.json'
import {
  PRESENTED_ROLE,
  DONATOR_ROLE,
  NITRO_BOOSTER_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
} from '@/defines/ids.json'
import {
  SUCCESS_COMMAND_DEFAULT,
  SUCCESS_DM_SEND,
  ERROR_DEFAULT,
  ERROR_MISS_PERMISSION,
  ERROR_MEMBER_IS_NOT_PRESENTED,
  ERROR_ACCESS_DM,
  ERROR_INVALID_ARGUMENT,
  ERROR_CHANNEL_PERMISSION,
  ERROR_CANNOT_BE_BANNED,
  ERROR_PAGINATION,
} from '@/defines/localisation/defaults/reply.json'
import { NOT_FOUND, LANGUAGE_NONE } from '@/defines/localisation/defaults/display.json'
import { TIMEOUT_COMMAND_STRING, DEFINE_STRING_REPLACED } from '@/defines/values.json'
import { CommandGetOption, EmbedTemplateOptions, GetChannelOptions } from '@/types'

export const validDisplayDevRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_DEV_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || LANGUAGE_NONE
  )
}

export const validDisplayEngRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_ENG_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || LANGUAGE_NONE
  )
}

export const getUserAvatar = (author: User) => {
  return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=256`
}

export const isPresentedMember = (member: GuildMember) => {
  return member.roles.cache.some((v) => v.id === PRESENTED_ROLE.id)
}

export const isPrivileged = (member: GuildMember) => {
  return member.roles.cache.some((v) => v.id === DONATOR_ROLE.id || v.id === NITRO_BOOSTER_ROLE.id)
}

export const isHe4rtDelasMember = (member: GuildMember) => {
  return member.roles.cache.some((v) => v.id === HE4RT_DELAS_ROLE.id)
}

export const isBot = (author: User): boolean => {
  return !!author?.bot
}

export const isAdministrator = (member: GuildMember) => {
  return member.permissions.has(PermissionFlagsBits.Administrator), true
}

export const isValidListenerMessage = (message: Message) => {
  return (
    !isBot(message.author) && message.content && message.member && message.inGuild && message?.id && message?.author?.id
  )
}

export const isValidId = (id: number, arr: any[]) => {
  return !isNaN(id) && id <= arr.length && id > 0
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

export const getChannel = ({ client, id }: GetChannelOptions) => {
  return client.channels.cache.get(id) as TextBasedChannel
}

export const getOption: CommandGetOption = (interaction: CommandInteraction, target: string) => {
  return interaction.options.get(target) as CommandInteractionOption
}

export const replaceDefineString = (str: string, target: string) => {
  return str.replaceAll(DEFINE_STRING_REPLACED, target)
}

export const reply = (interaction: CommandInteraction) => {
  const success = async () => {
    return await interaction.reply({ content: SUCCESS_COMMAND_DEFAULT, ephemeral: true })
  }

  const successInAccessDM = async () => {
    await interaction.reply({ content: SUCCESS_DM_SEND, ephemeral: true })
  }

  const error = async () => {
    return await interaction.reply({
      content: ERROR_DEFAULT,
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
    await interaction.reply({ content: `${ERROR_CHANNEL_PERMISSION}${str}!` })
  }

  const errorPaginationFail = async () => {
    await interaction.reply({ content: ERROR_PAGINATION })
  }

  return {
    success,
    successInAccessDM,
    error,
    errorPermission,
    errorMemberIsNotPresented,
    errorInAccessDM,
    errorInMissingArgument,
    errorUserCannotBeBaned,
    errorSpecificChannel,
    errorPaginationFail,
  }
}
