import {
  CommandInteraction,
  DMChannel,
  EmbedBuilder,
  GuildMember,
  HexColorString,
  SlashCommandBuilder,
  TextBasedChannel,
} from 'discord.js'
import { Command } from '../types'
import {
  PRESENTATIONS_CHANNEL,
  PRESENTED_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
} from '../defines/ids.json'
import { INTRODUCE } from '../defines/commands.json'
import { TIMEOUT_COMMAND, TIMEOUT_COMMAND_STRING, COLORS } from '../defines/values.json'
import { embedTemplate, getUserAvatar } from './utils'

const nextTextMessage = async (dm: DMChannel, interaction: CommandInteraction): Promise<string> => {
  try {
    const result = await dm.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      time: TIMEOUT_COMMAND,
      max: 1,
    })

    return result.first()!.content
  } catch (e) {
    return TIMEOUT_COMMAND_STRING
  }
}

const nextMultipleAndRecursiveRolesSelection = async (
  roles: any[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
) => {
  await dm.send(text)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCE.SETS.CONTINUE_MESSAGE)

  const value = Number(await nextTextMessage(dm, interaction))

  if (!isNaN(value) && value && value !== 0) {
    member.roles.add(roles[value - 1].id)

    await nextMultipleAndRecursiveRolesSelection(roles, text, dm, member, interaction)
  } else if (value === 0) return
}

const nextRoleSelection = async (
  roles: any[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
) => {
  await dm.send(text)
  await dm.send(roles.reduce((acc, val, index) => (acc += index + 1 + ` -   ${val.emoji} ${val.name}` + '\n'), '\n'))

  const value = Number(await nextTextMessage(dm, interaction))

  if (!isNaN(value) && value && value !== 0) {
    member.roles.add(roles[value - 1].id)
  }
}

const nextHe4rtDelasRole = async (
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
): Promise<boolean> => {
  const roles: any[] = [HE4RT_DELAS_ROLE]

  await dm.send(INTRODUCE.SETS.USER.DELAS)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCE.SETS.CONTINUE_MESSAGE)

  const value = Number(await nextTextMessage(dm, interaction))

  if (!isNaN(value) && value && value !== 0) {
    member.roles.add(roles[value - 1].id)

    return true
  }

  return false
}

const validDisplayDevRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_DEV_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || '`Nenhuma`'
  )
}

const validDisplayEngRoles = (member: GuildMember) => {
  return (
    member?.roles?.cache
      ?.filter((role) => VALID_PRESENTATION_ENG_ROLES.some((v) => v.id === role.id))
      .map((role) => `<@&${role.id}>`)
      .join(', ') || '`Nenhuma`'
  )
}

export const useIntroduce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(INTRODUCE.TITLE)
    .setDescription(INTRODUCE.DESCRIPTION)
    .setDMPermission(true)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user
      const member = interaction.member as GuildMember
      const dm = await client.users?.createDM(author)

      if (!dm) {
        await interaction.reply({ content: 'Não foi possível enviar mensagem pelo privado!', ephemeral: true })

        return
      }

      if (interaction.channel?.id !== PRESENTATIONS_CHANNEL.id) {
        await interaction.reply({
          content: `Só é permitido usar este comando no canal ${PRESENTATIONS_CHANNEL.title}!`,
          ephemeral: true,
        })

        return
      }

      if (member?.roles?.cache.some((role) => role.id === PRESENTED_ROLE.id)) {
        await interaction.reply({ content: 'Você já se apresentou!', ephemeral: true })

        return
      }

      await interaction.reply({ content: 'Enviado na DM!', ephemeral: true })

      await dm.send(INTRODUCE.SETS.CONTINUE)
      const name = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCE.SETS.USER.NICK)
      const nick = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCE.SETS.USER.ABOUT)
      const about = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCE.SETS.USER.GIT)
      const git = await nextTextMessage(dm, interaction)

      if ([name, nick, about, git].some((v) => v === TIMEOUT_COMMAND_STRING)) {
        await dm.send('\n**Algum dos seus dados inseridos não é válido. Tente novamente, por favor!**\n')

        return
      }

      await nextMultipleAndRecursiveRolesSelection(
        VALID_PRESENTATION_DEV_ROLES,
        INTRODUCE.SETS.USER.LANGUAGES,
        dm,
        member,
        interaction
      )

      await nextRoleSelection(VALID_PRESENTATION_ENG_ROLES, INTRODUCE.SETS.USER.ENGLISH, dm, member, interaction)

      const isHe4rtDelasMember = await nextHe4rtDelasRole(dm, member, interaction)

      const fields = [
        [
          { name: '**Nome:**', value: name, inline: true },
          { name: '**Nickname:**', value: nick, inline: true },
          { name: '**Sobre:**', value: about, inline: true },
        ],
        [
          { name: '**GIT:**', value: git, inline: true },
          {
            name: '**Linguagens:**',
            value: validDisplayDevRoles(member),
          },
          {
            name: '**Nível de Inglês:**',
            value: validDisplayEngRoles(member),
            inline: true,
          },
        ],
      ]
      const embed = embedTemplate({
        title: `**Apresentação** » ${author.username}`,
        target: {
          user: author,
          icon: true,
        },
        color: isHe4rtDelasMember ? (COLORS.HE4RT_DELAS as HexColorString) : (COLORS.HE4RT as HexColorString),
        fields,
      })

      const channel = (client.channels.cache.get(PRESENTATIONS_CHANNEL.id) as TextBasedChannel) || interaction.channel

      await channel?.send({
        content: `👋 <@${interaction.user.id}>!`,
        embeds: [embed],
      })

      await member.roles.add(PRESENTED_ROLE.id)

      await dm.send(INTRODUCE.SETS.FINISH)
    },
  ]
}
