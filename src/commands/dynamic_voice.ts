import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CategoryChannel,
  ChannelType,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel,
} from 'discord.js'
import { Command, He4rtClient } from '@/types'
import { DYNAMIC_VOICE } from '@/defines/commands.json'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { DYNAMIC_VOICE_REASON, DYNAMIC_VOICE_MIN_SIZE, DYNAMIC_VOICE_MAX_SIZE } from '@/defines/values.json'
import {
  GRADUATION_CAP,
  OFFICE_BUILDING,
  OPEN_BOOK,
  PEOPLES,
  PLAY_CONSOLE,
  RED_CIRCLE,
  SOS,
  USER_SPEAKING,
  WAVING_HAND,
} from '@/defines/emojis.json'
import {
  TYPE_OPTION,
  LIMIT_OPTION,
  IN_DYNAMIC_VOICE_ERROR,
  TITLE_OPTION,
  GAMES,
  HELP,
  LIVE,
  MENTORSHIP,
  NEWBIE,
  NEW_FRIENDS,
  ONLY_ENGLISH,
  STUDYING,
  TALKING,
  WORK,
} from '-/commands/dynamic_voice.json'
import { embedTemplate, getGuild, getOption, getTargetMember, isLink, isPresentedMember, reply } from '@/utils'

export const useDynamicVoice = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(DYNAMIC_VOICE.TITLE)
    .setDescription(DYNAMIC_VOICE.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName('tipo')
        .setDescription(TYPE_OPTION)
        .setRequired(true)
        .addChoices(
          { name: '🗣 Only English', value: 0 },
          { name: '👥 Novas Amizades', value: 1 },
          { name: '👋 Novato', value: 2 },
          { name: '🎓 Mentoria', value: 3 },
          { name: '🏢 Trabalho', value: 4 },
          { name: '📖 Estudando', value: 5 },
          { name: '🔴 Live', value: 6 },
          { name: '🎮 Joguinhos', value: 7 },
          { name: '🗣 Conversando', value: 8 },
          { name: '🆘 ME AJUDAAA!!!!', value: 9 }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('limite')
        .setDescription(LIMIT_OPTION)
        .setRequired(true)
        .setMinValue(DYNAMIC_VOICE_MIN_SIZE)
        .setMaxValue(DYNAMIC_VOICE_MAX_SIZE)
    )
    .addStringOption((option) => option.setName('title-dynamic-voice').setDescription(TITLE_OPTION))

  const getEmoji = (type: number): string => {
    const emoji =
      {
        0: USER_SPEAKING,
        1: PEOPLES,
        2: WAVING_HAND,
        3: GRADUATION_CAP,
        4: OFFICE_BUILDING,
        5: OPEN_BOOK,
        6: RED_CIRCLE,
        7: PLAY_CONSOLE,
        8: USER_SPEAKING,
        9: SOS,
      }[type] || PEOPLES

    return emoji
  }

  const getTarget = (type: number): string => {
    const target =
      {
        0: ONLY_ENGLISH,
        1: NEW_FRIENDS,
        2: NEWBIE,
        3: MENTORSHIP,
        4: WORK,
        5: STUDYING,
        6: LIVE,
        7: GAMES,
        8: TALKING,
        9: HELP,
      }[type] || NEW_FRIENDS

    return target
  }

  const getType = (type: number, customizeTitle: string): string => {
    if (customizeTitle) {
      return `${getEmoji(type)} ${customizeTitle}`
    }

    return `${getEmoji(type)} ${getTarget(type)}`
  }

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const type = getOption(interaction, 'tipo')
      const limit = getOption(interaction, 'limite')
      const customizeTitle = getOption(interaction, 'title-dynamic-voice')

      if (isLink(customizeTitle?.value as string)) {
        await reply(interaction).errorIsNotValidTitle()

        return
      }

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const guild = getGuild(client)
      const category = guild.channels.cache.get(DYNAMIC_CATEGORY_CHANNEL.id) as CategoryChannel

      const typeTitle = getType(type.value as number, customizeTitle?.value as string)

      if (member.voice.channel?.parent?.id === DYNAMIC_CATEGORY_CHANNEL.id) {
        await interaction.reply({ content: IN_DYNAMIC_VOICE_ERROR, ephemeral: true })

        return
      }

      const voice = await guild.channels.create({
        name: typeTitle,
        type: ChannelType.GuildVoice,
        parent: category,
        userLimit: limit.value as number,
        reason: DYNAMIC_VOICE_REASON,
      })

      const invite = await voice.createInvite({
        unique: true,
        temporary: true,
        maxUses: 1,
        maxAge: 60 * 60,
      })

      client.logger.emit({
        message: `${getTargetMember(member)} criou o canal de voz dinâmico **${typeTitle}**`,
        type: 'command',
        color: 'success',
      })

      const embed = embedTemplate({
        title: `Canal de Voz Dinâmico`,
        description: `Controle nos botoes abaixo a quantidade de pessoas que podem permanecer no mesmo canal caso haja necessidade. **Apenas o criador do canal pode controlar, e o limite mínimo de membros é ${DYNAMIC_VOICE_MIN_SIZE} e o máximo é ${DYNAMIC_VOICE_MAX_SIZE}!**`,
        fields: [
          [
            { name: '**ID do Canal**', value: invite.channelId, inline: false },
            { name: '**ID do Autor**', value: interaction.user.id, inline: false },
          ],
        ],
      })

      const component = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder().setCustomId('c-dynamic-voice-decrease').setLabel('-').setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder().setCustomId('c-dynamic-voice-increment').setLabel('+').setStyle(ButtonStyle.Success)
        )

      await voice
        .send({
          content: `<@${member.id}> aqui está o seu novo canal de voz!`,
          embeds: [embed],
          components: [component],
        })
        .catch(() => {})

      await interaction.reply({ content: invite.url, ephemeral: true }).catch(() => {})
    },
  ]
}

export const resolveDynamicVoiceUserLimitControl = async (client: He4rtClient, interaction: ButtonInteraction) => {
  if (interaction.customId.startsWith('c-dynamic-voice')) {
    const channel_id = interaction.message.embeds[0].data.fields[0].value
    const author_id = interaction.message.embeds[0].data.fields[1].value

    if (interaction.user.id !== author_id) return

    const guild = getGuild(client)
    const channel = guild.channels.cache.get(channel_id) as VoiceChannel

    if (interaction.customId === 'c-dynamic-voice-decrease') {
      if (channel.userLimit <= DYNAMIC_VOICE_MIN_SIZE) {
        await reply(interaction)
          .error()
          .catch(() => {})

        return
      }

      channel
        .setUserLimit(--channel.userLimit)
        .then(async () => {
          await reply(interaction)
            .success()
            .catch(() => {})
        })
        .catch(async () => {
          await reply(interaction)
            .error()
            .catch(() => {})
        })
    }

    if (interaction.customId === 'c-dynamic-voice-increment') {
      if (channel.userLimit >= DYNAMIC_VOICE_MAX_SIZE) {
        await reply(interaction)
          .error()
          .catch(() => {})

        return
      }

      channel
        .setUserLimit(++channel.userLimit)
        .then(async () => {
          await reply(interaction)
            .success()
            .catch(() => {})
        })
        .catch(async () => {
          await reply(interaction)
            .error()
            .catch(() => {})
        })
    }
  }
}
