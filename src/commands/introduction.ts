import { CommandInteraction, DMChannel, GuildMember, SlashCommandBuilder, Message } from 'discord.js'
import { Command, IntroducePOST, IntroducePUT, RoleDefine, UserGETBody } from '@/types'
import {
  PRESENTATIONS_CHANNEL,
  PRESENTED_ROLE,
  PRESENTING_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
  VALID_PRESENTATION_RF,
  HE4RT_EMOJI_ID,
} from '@/defines/ids.json'
import INTRODUCTION from '-/commands/introduction.json'
import { INTRODUCE } from '@/defines/commands.json'
import { TIMEOUT_COMMAND, FORCE_STOP_COMMAND, TIMEOUT_MAX_RETRY, TIMEOUT_COMMAND_STRING } from '@/defines/values.json'
import {
  getChannel,
  getTargetMember,
  isPresentingMember,
  isStopEntryCommand,
  isValidId,
  reply,
  sendInDM,
  validDisplayDevRoles,
  validDisplayEngRoles,
} from '@/utils'
import { embedTemplate } from '@/utils'

const setPresentingFlag = async (member: GuildMember) => {
  await member.roles.add(PRESENTING_ROLE.id)
}

const removePresentingFlag = async (member: GuildMember) => {
  await member.roles.remove(PRESENTING_ROLE.id)
}

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

const nextMultipleRoleSelection = async (
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

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    await nextMultipleRoleSelection(roles, text, dm, member, interaction)

    return
  }

  if (value === 0) return

  await dm.send(INTRODUCTION.INVALID_NUMBER)
  await nextMultipleRoleSelection(roles, text, dm, member, interaction)
}

const nextUFSelection = async (dm: DMChannel, interaction: CommandInteraction): Promise<string> => {
  await dm.send(
    VALID_PRESENTATION_RF.reduce(
      (acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.id} ${val.name}` + '\n'),
      '\n'
    )
  )

  const response = await nextTextMessage(dm, interaction)

  if (response.trim().toLowerCase() === FORCE_STOP_COMMAND) return FORCE_STOP_COMMAND

  const value = Number(response)

  if (isValidId(value, VALID_PRESENTATION_RF)) return VALID_PRESENTATION_RF[value - 1].id

  await dm.send(INTRODUCTION.INVALID_NUMBER)
  return TIMEOUT_COMMAND_STRING
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

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    return
  }

  await dm.send(INTRODUCTION.INVALID_NUMBER)
  await nextRoleSelection(roles, text, dm, member, interaction)
}

const nextHe4rtDelasRole = async (
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
): Promise<boolean> => {
  const roles: RoleDefine[] = [HE4RT_DELAS_ROLE]

  await dm.send(INTRODUCTION.USER.DELAS)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

  const value = Number(await nextTextMessage(dm, interaction))

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    return true
  }

  return false
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction): Promise<boolean> => {
  await sendInDM(dm, interaction, INTRODUCTION.CONTINUE)

  if (!sendInDM) return false

  await reply(interaction).successInAccessDM()

  return true
}

const nextStringsData = async (
  dm: DMChannel,
  interaction: CommandInteraction,
  attempts = 1
): Promise<UserGETBody | false> => {
  await dm.send(INTRODUCTION.USER.NAME)
  const name = await nextTextMessage(dm, interaction)

  if (isStopEntryCommand(name)) return false

  await dm.send(INTRODUCTION.USER.NICK)
  const nickname = await nextTextMessage(dm, interaction)

  if (isStopEntryCommand(nickname)) return false

  await dm.send(INTRODUCTION.USER.ABOUT)
  const about = await nextTextMessage(dm, interaction)

  if (isStopEntryCommand(about)) return false

  await dm.send(INTRODUCTION.USER.GIT)
  const git = await nextTextMessage(dm, interaction)

  if (isStopEntryCommand(git)) return false

  await dm.send(INTRODUCTION.USER.LINKEDIN)
  const linkedin = await nextTextMessage(dm, interaction)

  if (isStopEntryCommand(linkedin)) return false

  await dm.send(INTRODUCTION.USER.RF)
  const uf = await nextUFSelection(dm, interaction)

  if (isStopEntryCommand(uf)) return false

  if ([name, nickname, about, git, linkedin, uf].some((v) => v === TIMEOUT_COMMAND_STRING || !v)) {
    if (attempts >= TIMEOUT_MAX_RETRY) return false

    await dm.send(INTRODUCTION.INVALID_STRING_DATA)

    return await nextStringsData(dm, interaction, ++attempts)
  }

  return {
    name,
    nickname,
    about,
    git,
    linkedin,
    uf,
  }
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

      if (isPresentingMember(member)) {
        await reply(interaction).errorPresentingFail()

        return
      }

      client.users
        .createDM(author)
        .then(async (dm) => {
          const valid = await validateAccess(dm, interaction)

          if (!valid) return

          await setPresentingFlag(member)

          const body = await nextStringsData(dm, interaction)

          if (!body) return await dm.send(INTRODUCTION.STOP)

          await nextMultipleRoleSelection(
            VALID_PRESENTATION_DEV_ROLES,
            INTRODUCTION.USER.LANGUAGES,
            dm,
            member,
            interaction
          )

          await nextRoleSelection(VALID_PRESENTATION_ENG_ROLES, INTRODUCTION.USER.ENGLISH, dm, member, interaction)

          const isHe4rtDelasMember = await nextHe4rtDelasRole(dm, member, interaction)

          const embed = embedTemplate({
            title: `${INTRODUCTION.EMBED.TITLE}${author.username}`,
            target: {
              user: author,
              icon: true,
            },
            delas: isHe4rtDelasMember,
            fields: [
              [
                { name: INTRODUCTION.EMBED.NAME, value: body.name, inline: true },
                { name: INTRODUCTION.EMBED.NICKNAME, value: body.nickname, inline: true },
                { name: INTRODUCTION.EMBED.ABOUT, value: body.about, inline: true },
              ],
              [
                { name: INTRODUCTION.EMBED.GIT, value: body.git, inline: true },
                { name: INTRODUCTION.EMBED.LINKEDIN, value: body.linkedin, inline: true },
                {
                  name: INTRODUCTION.EMBED.LANGUAGES,
                  value: validDisplayDevRoles(member),
                },
                {
                  name: INTRODUCTION.EMBED.ENGLISH,
                  value: validDisplayEngRoles(member),
                  inline: true,
                },
              ],
            ],
          })

          const channel = getChannel({ id: PRESENTATIONS_CHANNEL.id, client })

          await channel
            .send({
              content: `👋 <@${interaction.user.id}>!`,
              embeds: [embed],
            })
            .then(async (msg: Message) => {
              await msg.react(HE4RT_EMOJI_ID).catch(async () => {
                await msg.react('💜').catch(() => {})
              })
            })

          await member.roles.add(PRESENTED_ROLE.id)
          await removePresentingFlag(member)

          client.api.he4rt
            .users()
            .post<IntroducePOST>({
              discord_id: member.id,
            })
            .then(() => {
              client.logger.emit({
                type: 'http',
                color: 'info',
                message: `${getTargetMember(member)} apresentou e teve a sua conta criada!`,
                user: member.user,
              })

              client.api.he4rt
                .users(member.id)
                .put<IntroducePUT>(body)
                .catch(() => {})
            })
            .catch(() => {
              client.api.he4rt
                .users(member.id)
                .put<IntroducePUT>(body)
                .then(() => {
                  client.logger.emit({
                    type: 'http',
                    color: 'info',
                    message: `${getTargetMember(member)} apresentou e teve a sua conta alterada!`,
                    user: member.user,
                  })
                })
                .catch(() => {})
            })

          await dm.send(INTRODUCTION.FINISH)
        })
        .catch(() => {})
        .finally(async () => {
          await removePresentingFlag(member)
        })
    },
  ]
}
