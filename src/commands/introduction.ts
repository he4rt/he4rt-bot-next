import { CommandInteraction, DMChannel, GuildMember, SlashCommandBuilder, Message } from 'discord.js'
import { Cancellable, Command, IntroducePOST, IntroducePUT, RoleDefine, UserGETBody } from '@/types'
import {
  PRESENTATIONS_CHANNEL,
  PRESENTED_ROLE,
  PRESENTING_ROLE,
  HE4RT_DELAS_ROLE,
  VALID_PRESENTATION_DEV_ROLES,
  VALID_PRESENTATION_ENG_ROLES,
  VALID_PRESENTATION_RF,
  HE4RT_EMOJI_ID,
  HE4RT_DELAS_EMOJI_ID,
} from '@/defines/ids.json'
import INTRODUCTION from '-/commands/introduction.json'
import { INTRODUCE } from '@/defines/commands.json'
import { TIMEOUT_COMMAND, TIMEOUT_COMMAND_STRING } from '@/defines/values.json'
import {
  getChannel,
  getTargetMember,
  isCancellable,
  isPresentingMember,
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

const nextTextMessage = async (dm: DMChannel, interaction: CommandInteraction): Promise<Cancellable<string>> => {
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
): Promise<number | boolean> => {
  await dm.send(text)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

  const tg = await nextTextMessage(dm, interaction)

  if (isCancellable(tg)) return false

  const value = Number(tg)

  if (value === 0) return true

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    await nextMultipleRoleSelection(roles, text, dm, member, interaction)
  }
}

const nextUFSelection = async (dm: DMChannel, interaction: CommandInteraction): Promise<string | false> => {
  await dm.send(
    VALID_PRESENTATION_RF.reduce(
      (acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.id} ${val.name}` + '\n'),
      '\n'
    )
  )

  const response = await nextTextMessage(dm, interaction)

  if (isCancellable(response)) return false

  const value = Number(response)

  if (isValidId(value, VALID_PRESENTATION_RF)) return VALID_PRESENTATION_RF[value - 1].id

  return false
}

const nextRoleSelection = async (
  roles: any[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
): Promise<number | false> => {
  await dm.send(text)
  await dm.send(roles.reduce((acc, val, index) => (acc += index + 1 + ` -   ${val.emoji} ${val.name}` + '\n'), '\n'))

  const tg = await nextTextMessage(dm, interaction)

  if (isCancellable(tg)) return false

  const value = Number(tg)

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    return value
  }

  return false
}

const nextHe4rtDelasRole = async (
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
): Promise<number | false> => {
  const roles: RoleDefine[] = [HE4RT_DELAS_ROLE]

  await dm.send(INTRODUCTION.USER.DELAS)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

  const tg = await nextTextMessage(dm, interaction)

  if (isCancellable(tg)) return false

  const value = Number(tg)

  if (isValidId(value, roles)) member.roles.add(roles[value - 1].id)

  return value
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction): Promise<boolean> => {
  await sendInDM(dm, interaction, INTRODUCTION.CONTINUE)

  if (!sendInDM) return false

  await reply(interaction).successInAccessDM()

  return true
}

const nextStringsData = async (dm: DMChannel, interaction: CommandInteraction): Promise<UserGETBody | false> => {
  await dm.send(INTRODUCTION.USER.NAME)
  const name = await nextTextMessage(dm, interaction)
  if (isCancellable(name)) return false

  await dm.send(INTRODUCTION.USER.NICK)
  const nickname = await nextTextMessage(dm, interaction)
  if (isCancellable(nickname)) return false

  await dm.send(INTRODUCTION.USER.ABOUT)
  const about = await nextTextMessage(dm, interaction)
  if (isCancellable(about)) return false

  await dm.send(INTRODUCTION.USER.GIT)
  const git = await nextTextMessage(dm, interaction)
  if (isCancellable(git)) return false

  await dm.send(INTRODUCTION.USER.LINKEDIN)
  const linkedin = await nextTextMessage(dm, interaction)
  if (isCancellable(linkedin)) return false

  await dm.send(INTRODUCTION.USER.UF)
  const uf = await nextUFSelection(dm, interaction)
  if (!uf) return false

  if ([name, nickname, about, git, linkedin].some((v) => v === TIMEOUT_COMMAND_STRING || !v)) return false

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

          if (body === false) return await dm.send(INTRODUCTION.STOP)

          const multipleRoles = await nextMultipleRoleSelection(
            VALID_PRESENTATION_DEV_ROLES,
            INTRODUCTION.USER.LANGUAGES,
            dm,
            member,
            interaction
          )

          if (multipleRoles === false) return await dm.send(INTRODUCTION.STOP)

          const role = await nextRoleSelection(
            VALID_PRESENTATION_ENG_ROLES,
            INTRODUCTION.USER.ENGLISH,
            dm,
            member,
            interaction
          )

          if (role === false) return await dm.send(INTRODUCTION.STOP)

          const delas = await nextHe4rtDelasRole(dm, member, interaction)

          if (delas === false) return await dm.send(INTRODUCTION.STOP)

          const embed = embedTemplate({
            title: `${INTRODUCTION.EMBED.TITLE}${author.username}`,
            target: {
              user: author,
              icon: true,
            },
            delas: delas === 1,
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
              await msg.react(delas === 1 ? HE4RT_DELAS_EMOJI_ID : HE4RT_EMOJI_ID).catch(async () => {
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
