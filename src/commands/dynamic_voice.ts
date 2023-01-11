import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CategoryChannel,
  ChannelType,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel,
} from 'discord.js'
import { Command, He4rtClient } from '@/types'
import { DYNAMIC_VOICE } from '@/defines/commands.json'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { DYNAMIC_VOICE_REASON, DYNAMIC_VOICE_MIN_SIZE, DYNAMIC_VOICE_MAX_SIZE } from '@/defines/values.json'
import { TYPE_OPTION, LIMIT_OPTION, IN_DYNAMIC_VOICE_ERROR } from '-/commands/dynamic_voice.json'
import { embedTemplate, getGuild, getOption, getTargetMember, isPresentedMember, reply } from '@/utils'

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
          { name: '📖 Estudando', value: 5 }
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

  const getType = (value: number): string => {
    return {
      0: '🗣 Only English',
      1: '👥 Novas Amizades',
      2: '👋 Novato',
      3: '🎓 Mentoria',
      4: '🏢 Trabalho',
      5: '📖 Estudando',
    }[value]
  }

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const type = getOption(interaction, 'tipo')
      const limit = getOption(interaction, 'limite')

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const guild = getGuild(client)
      const category = guild.channels.cache.get(DYNAMIC_CATEGORY_CHANNEL.id) as CategoryChannel

      const typeTitle = getType(type.value as number)

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

      voice.permissionOverwrites
        .edit(guild.id, { SendMessages: true, ViewChannel: true, Speak: true, Connect: true })
        .catch(() => {})

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
        description:
          'Controle nos botoes abaixo a quantidade de pessoas que podem permanecer no mesmo canal caso haja necessidade. **Apenas o criador do canal pode controlar!**',
        fields: [
          [
            { name: '**ID do Canal**', value: invite.channelId, inline: false },
            { name: '**ID do Autor**', value: interaction.user.id, inline: false },
          ],
        ],
      })

      const component = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder().setCustomId('c-dynamic-voice-decrease').setLabel('Diminuir').setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('c-dynamic-voice-increment')
            .setLabel('Aumentar')
            .setStyle(ButtonStyle.Success)
        )

      await voice
        .send({
          content: `<@${member.id}> aqui está o seu novo canal de voz!`,
          embeds: [embed],
          components: [component],
        })
        .catch(() => {})

      await interaction.reply({ content: invite.url, ephemeral: true })
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
      if (channel.userLimit <= DYNAMIC_VOICE_MIN_SIZE) await reply(interaction).error()

      channel
        .setUserLimit(--channel.userLimit)
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    }

    if (interaction.customId === 'c-dynamic-voice-increment') {
      if (channel.userLimit >= DYNAMIC_VOICE_MAX_SIZE) await reply(interaction).error()

      channel
        .setUserLimit(++channel.userLimit)
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    }
  }
}
