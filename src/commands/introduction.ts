import {
  CommandInteraction,
  DMChannel,
  GuildMember,
  SlashCommandBuilder,
  Message,
  ButtonInteraction,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js'
import { Cancellable, Command, CommandSet, He4rtClient, IntroducePOST, RoleDefine, UserGETBody } from '@/types'
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
  sendMessageToChannel,
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

const nextTextMessage = async (
  dm: DMChannel,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<Cancellable<string>> => {
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
  roles: RoleDefine[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<number | boolean> => {
  await dm.send(text)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n'),
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

const nextUFSelection = async (
  dm: DMChannel,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<string | false> => {
  await dm.send(
    VALID_PRESENTATION_RF.reduce(
      (acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.id} ${val.name}` + '\n'),
      '\n',
    ),
  )

  const response = await nextTextMessage(dm, interaction)

  if (isCancellable(response)) return false

  const value = Number(response)

  if (isValidId(value, VALID_PRESENTATION_RF)) return VALID_PRESENTATION_RF[value - 1].id

  return false
}

const nextRoleSelection = async (
  roles: RoleDefine[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction | ButtonInteraction,
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
  interaction: CommandInteraction | ButtonInteraction,
): Promise<number | false> => {
  const roles: RoleDefine[] = [HE4RT_DELAS_ROLE]

  await dm.send(INTRODUCTION.USER.DELAS)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n'),
  )
  await dm.send(INTRODUCTION.CONTINUE_MESSAGE)

  const tg = await nextTextMessage(dm, interaction)

  if (isCancellable(tg)) return false

  const value = Number(tg)

  if (isValidId(value, roles)) member.roles.add(roles[value - 1].id)

  return value
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction | ButtonInteraction): Promise<boolean> => {
  await sendInDM(dm, interaction, INTRODUCTION.CONTINUE)

  if (!sendInDM) return false

  await reply(interaction).successInAccessDM()

  return true
}

const nextStringsData = async (
  dm: DMChannel,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<UserGETBody | false> => {
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
  const github_url = await nextTextMessage(dm, interaction)
  if (isCancellable(github_url)) return false

  await dm.send(INTRODUCTION.USER.LINKEDIN)
  const linkedin_url = await nextTextMessage(dm, interaction)
  if (isCancellable(linkedin_url)) return false

  await dm.send(INTRODUCTION.USER.UF)
  const uf = await nextUFSelection(dm, interaction)
  if (!uf) return false

  if ([name, nickname, about, github_url, linkedin_url].some((v) => v === TIMEOUT_COMMAND_STRING || !v)) return false

  return {
    info: {
      name,
      nickname,
      about,
      github_url,
      linkedin_url,
      birthdate: '1999-01-01',
    },
    address: {
      state: uf,
    },
  }
}

const ensureStickyIntroductionMessage = async (client: He4rtClient) => {
  const channel = getChannel<TextChannel>({ id: PRESENTATIONS_CHANNEL.id, client })

  const messages = await channel.messages.fetchPinned()

  for (const [_, message] of messages) {
    await message.delete().catch(() => {})
  }

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('c-introduce')
      .setLabel(INTRODUCTION.STICKY.CALL_TO_ACTION)
      .setStyle(ButtonStyle.Primary),
  )

  const embed = embedTemplate({
    title: INTRODUCTION.STICKY.TITLE,
    description: INTRODUCTION.STICKY.DESCRIPTION,
    target: {
      user: client.user,
      icon: true,
    },
  })

  try {
    const msg = await sendMessageToChannel(channel, {
      embeds: [embed],
      components: [component],
    })

    if (msg) {
      await msg.pin()
    }
  } catch (e) {
    client.logger.emit({
      type: 'bot',
      color: 'error',
      message: `Não foi possível criar ou fixar a mensagem de introdução: ${e}`,
    })
  }
}

const startIntroductionFlow = async (
  client: He4rtClient,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<void> => {
  const author = interaction.user
  const member = interaction.member as GuildMember

  try {
    if (isPresentingMember(member)) {
      await reply(interaction).errorPresentingFail()

      return
    }

    const dm = await client.users.createDM(author)

    const valid = await validateAccess(dm, interaction)

    if (!valid) return

    await setPresentingFlag(member)

    const body = await nextStringsData(dm, interaction)

    if (body === false) {
      await dm.send(INTRODUCTION.STOP)
      return
    }

    const multipleRoles = await nextMultipleRoleSelection(
      VALID_PRESENTATION_DEV_ROLES,
      INTRODUCTION.USER.LANGUAGES,
      dm,
      member,
      interaction,
    )

    if (multipleRoles === false) {
      await dm.send(INTRODUCTION.STOP)
      return
    }

    const role = await nextRoleSelection(
      VALID_PRESENTATION_ENG_ROLES,
      INTRODUCTION.USER.ENGLISH,
      dm,
      member,
      interaction,
    )

    if (role === false) {
      await dm.send(INTRODUCTION.STOP)
      return
    }

    const delas = await nextHe4rtDelasRole(dm, member, interaction)

    if (delas === false) {
      await dm.send(INTRODUCTION.STOP)
      return
    }

    const embed = embedTemplate({
      title: `${INTRODUCTION.EMBED.TITLE}${author.username}`,
      target: {
        user: author,
        icon: true,
      },
      delas: delas === 1,
      fields: [
        [
          { name: INTRODUCTION.EMBED.NAME, value: body.info.name, inline: true },
          { name: INTRODUCTION.EMBED.NICKNAME, value: body.info.nickname, inline: true },
          { name: INTRODUCTION.EMBED.ABOUT, value: body.info.about, inline: true },
        ],
        [
          { name: INTRODUCTION.EMBED.GIT, value: body.info.github_url, inline: true },
          { name: INTRODUCTION.EMBED.LINKEDIN, value: body.info.linkedin_url, inline: true },
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

    const msg = (await sendMessageToChannel(channel, {
      content: `👋 <@${interaction.user.id}>!`,
      embeds: [embed],
    })) as Message

    if (msg) {
      await msg.react(delas === 1 ? HE4RT_DELAS_EMOJI_ID : HE4RT_EMOJI_ID).catch(async () => {
        await msg.react('💜').catch(() => {})
      })
    }

    await member.roles.add(PRESENTED_ROLE.id)
    await removePresentingFlag(member)

    await ensureStickyIntroductionMessage(client)

    client.api.he4rt.providers.discord
      .post<IntroducePOST>({
        provider_id: member.id,
        username: `${member?.nickname ?? member.user.username}-${member.user.discriminator}`,
      })
      .then(() => {
        client.api.he4rt.users
          .profile(member.id)
          .put<IntroducePOST>(body)
          .then(() => {
            client.logger.emit({
              type: 'http',
              color: 'info',
              message: `${getTargetMember(member)} apresentou e teve a sua conta criada!`,
              user: member.user,
            })
          })
          .catch((e) => {
            client.logger.emit({
              type: 'http',
              color: 'error',
              message: `${getTargetMember(member)} não consegiu criar sua conta! Erro: ${e}`,
              user: member.user,
            })
          })
      })
      .catch(() => {
        client.api.he4rt.users
          .profile(member.id)
          .put<IntroducePOST>(body)
          .then(() => {
            client.logger.emit({
              type: 'http',
              color: 'info',
              message: `${getTargetMember(member)} apresentou e teve a sua conta alterada!`,
              user: member.user,
            })
          })
          .catch((e) => {
            client.logger.emit({
              type: 'http',
              color: 'error',
              message: `${getTargetMember(member)} não consegiu criar sua conta! Erro: ${e}`,
              user: member.user,
            })
          })
      })

    await dm.send(INTRODUCTION.FINISH)
  } catch (error) {
    client.logger.emit({
      type: 'bot',
      color: 'error',
      message: `Erro no fluxo de introdução para ${getTargetMember(member)}: ${error}`,
      user: member.user,
    })
  } finally {
    await removePresentingFlag(member)
  }
}

export const useIntroduction = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(INTRODUCE.TITLE)
    .setDescription(INTRODUCE.DESCRIPTION)
    .setDMPermission(true) as CommandSet

  return [data, async (interaction, client) => startIntroductionFlow(client, interaction)]
}

export const resolveIntroduceCommandButtonEvents = async (client: He4rtClient, interaction: ButtonInteraction) => {
  if (interaction.customId === 'c-introduce') {
    await startIntroductionFlow(client, interaction)
  }
}
