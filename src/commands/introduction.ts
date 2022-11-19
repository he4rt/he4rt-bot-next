import {
  CommandInteraction,
  DMChannel,
  GuildMember,
  HexColorString,
  SlashCommandBuilder,
  TextBasedChannel,
} from 'discord.js'
import { Command, IntroducePOST, IntroducePUT } from '@/types'
import {
  PRESENTATIONS_CHANNEL,
  PRESENTED_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
} from '@/defines/ids.json'
import { INTRODUCE } from '@/defines/commands.json'
import { TIMEOUT_COMMAND, TIMEOUT_COMMAND_STRING, COLORS } from '@/defines/values.json'
import INTRODUCTION from '@/defines/localisation/commands/introduction.json'
import { validDisplayDevRoles, validDisplayEngRoles } from '@/utils'
import { embedTemplate } from '@/utils'
import { ofetch } from 'ofetch'
import JSON_PARSE from 'destr'

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
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

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

  await dm.send(INTRODUCTION.USER.DELAS)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

  const value = Number(await nextTextMessage(dm, interaction))

  if (!isNaN(value) && value && value !== 0) {
    member.roles.add(roles[value - 1].id)

    return true
  }

  return false
}

export const useIntroduction = (): Command => {
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

      await interaction.reply({ content: 'Enviado na DM!', ephemeral: true })

      await dm.send(INTRODUCTION.CONTINUE)
      const name = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCTION.USER.NICK)
      const nickname = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCTION.USER.ABOUT)
      const about = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCTION.USER.GIT)
      const git = await nextTextMessage(dm, interaction)

      await dm.send(INTRODUCTION.USER.LINKEDIN)
      const linkedin = await nextTextMessage(dm, interaction)

      if ([name, nickname, about, git, linkedin].some((v) => v === TIMEOUT_COMMAND_STRING)) {
        await dm.send('\n**Algum dos seus dados inseridos não é válido. Tente novamente, por favor!**\n')

        return
      }

      await nextMultipleAndRecursiveRolesSelection(
        VALID_PRESENTATION_DEV_ROLES,
        INTRODUCTION.USER.LANGUAGES,
        dm,
        member,
        interaction
      )

      await nextRoleSelection(VALID_PRESENTATION_ENG_ROLES, INTRODUCTION.USER.ENGLISH, dm, member, interaction)

      const isHe4rtDelasMember = await nextHe4rtDelasRole(dm, member, interaction)

      const fields = [
        [
          { name: '**Nome:**', value: name, inline: true },
          { name: '**Nickname:**', value: nickname, inline: true },
          { name: '**Sobre:**', value: about, inline: true },
        ],
        [
          { name: '**GIT:**', value: git, inline: true },
          { name: '**Linkedin:**', value: linkedin, inline: true },
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

      ofetch<IntroducePUT>(`${process.env.API_URL}/users/${member.id}`, {
        parseResponse: JSON_PARSE,
        headers: { Authorization: process.env.HE4RT_TOKEN },
        method: 'PUT',
        body: {
          name,
          nickname,
          git,
          about,
        },
      }).catch(() => {
        ofetch<IntroducePOST>(`${process.env.API_URL}/users/`, {
          parseResponse: JSON_PARSE,
          headers: { Authorization: process.env.HE4RT_TOKEN },
          method: 'POST',
          body: {
            discord_id: member.id,
          },
        })
          .then(() => {
            ofetch<IntroducePUT>(`${process.env.API_URL}/users/${member.id}`, {
              parseResponse: JSON_PARSE,
              headers: { Authorization: process.env.HE4RT_TOKEN },
              method: 'PUT',
              body: {
                name,
                nickname,
                git,
                about,
              },
            }).catch(() => {})
          })
          .catch(() => {})
      })

      await dm.send(INTRODUCTION.FINISH)
    },
  ]
}
