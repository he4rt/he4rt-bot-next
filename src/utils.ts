import {
  CommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
  GuildMember,
  HexColorString,
  Message,
  TextBasedChannel,
  User,
} from 'discord.js'
import { COLORS, HE4RT_DELAS_ICON_1_URL, HE4RT_ICON_1_URL } from '@/defines/values.json'
import {
  DONATOR_ROLE,
  NITRO_BOOSTER_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
} from '@/defines/ids.json'
import { CANNOT_BE_BANNED } from '@/defines/localisation/defaults/reply.json'
import { TIMEOUT_COMMAND_STRING, DEFINE_STRING_REPLACED } from '@/defines/values.json'
import { CommandGetOption, EmbedTemplateOptions, GetChannelOptions } from '@/types'

export const validDisplayDevRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_DEV_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || '`Nenhuma`'
  )
}

export const validDisplayEngRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_ENG_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || '`Nenhuma`'
  )
}

export const getUserAvatar = (author: User) => {
  return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=256`
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

export const isValidListenerMessage = (message: Message) => {
  return (
    !isBot(message.author) && message.content && message.member && message.inGuild && message?.id && message?.author?.id
  )
}

export const isValidId = (id: number, arr: any[]) => {
  return !isNaN(id) && id <= arr.length && id > 0
}

export const normalizeStringData = (str: string) => {
  return str !== TIMEOUT_COMMAND_STRING ? str : '`Não Encontrado`'
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
        text: `${new Date().getFullYear()} © He4rt Developers`,
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
    return await interaction.reply({ content: 'Comando executado com sucesso!', ephemeral: true })
  }

  const successInAccessDM = async () => {
    await interaction.reply({ content: 'Enviado na DM!', ephemeral: true })
  }

  const error = async () => {
    return await interaction.reply({
      content: 'Algum erro inesperado ocorreu. Tente novamente mais tarde!',
      ephemeral: true,
    })
  }

  const errorPermission = async () => {
    return await interaction.reply({ content: 'Você não tem permissão para realizar esta ação!', ephemeral: true })
  }

  const errorInAccessDM = async () => {
    await interaction.reply({ content: 'Não foi possível enviar mensagem pelo privado!', ephemeral: true })
  }

  const errorInMissingArgument = async () => {
    await interaction.reply({ content: 'Algum argumento inserido é inválido!', ephemeral: true })
  }

  const errorUserCannotBeBaned = async () => {
    await interaction.reply({ content: CANNOT_BE_BANNED, ephemeral: true })
  }

  const errorSpecificChannel = async (str: string) => {
    await interaction.reply({ content: `Só é permitido usar este comando no canal ${str}!` })
  }

  const errorPaginationFail = async () => {
    await interaction.reply({ content: `Este número de página não existe.` })
  }

  return {
    success,
    successInAccessDM,
    error,
    errorPermission,
    errorInAccessDM,
    errorInMissingArgument,
    errorUserCannotBeBaned,
    errorSpecificChannel,
    errorPaginationFail,
  }
}
