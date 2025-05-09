import { CategoryChannel, ChannelType, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { DYNAMIC_VOICE } from '@/defines/commands.json'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import {
  DYNAMIC_VOICE_REASON,
  DYNAMIC_VOICE_MIN_SIZE,
  DYNAMIC_VOICE_MAX_SIZE,
  DYNAMIC_VOICE_OPTIONS,
  DYNAMIC_VOICE_STUDYING_OPTIONS,
} from '@/defines/values.json'
import { TYPE_OPTION, STUDYING_TITLE_OPTION, LIMIT_OPTION, IN_DYNAMIC_VOICE_ERROR } from '-/commands/dynamic_voice.json'
import {
  dynamicVoiceEmbedTemplate,
  getChannel,
  getGuild,
  getOption,
  getOptionType,
  getTargetMember,
  isPresentedMember,
  reply,
} from '@/utils'

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
        .addChoices(...DYNAMIC_VOICE_OPTIONS),
    )
    .addIntegerOption((option) =>
      option
        .setName('limite')
        .setDescription(LIMIT_OPTION)
        .setRequired(true)
        .setMinValue(DYNAMIC_VOICE_MIN_SIZE)
        .setMaxValue(DYNAMIC_VOICE_MAX_SIZE),
    )
    .addIntegerOption((option) =>
      option
        .setName('estudando-titulo')
        .setDescription(STUDYING_TITLE_OPTION)
        .addChoices(...DYNAMIC_VOICE_STUDYING_OPTIONS),
    ) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const type = getOption(interaction, 'tipo')
      const limit = getOption(interaction, 'limite')
      const optional_study = getOption(interaction, 'estudando-titulo')

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const guild = getGuild(client)
      const category = getChannel<CategoryChannel>({ client, id: DYNAMIC_CATEGORY_CHANNEL.id })

      const typeTitle =
        optional_study?.value && type.value === 5
          ? `📖 ${getOptionType(DYNAMIC_VOICE_STUDYING_OPTIONS, optional_study.value as number)}`
          : getOptionType(DYNAMIC_VOICE_OPTIONS, type.value as number)

      if (member?.voice?.channel?.parent?.id === DYNAMIC_CATEGORY_CHANNEL.id) {
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

      await dynamicVoiceEmbedTemplate(voice, member, { send: true })

      client.logger.emit({
        message: `${getTargetMember(member)} criou o canal de voz dinâmico **${typeTitle}**`,
        type: 'command',
        color: 'success',
      })

      await interaction.reply({ content: invite.url, ephemeral: true }).catch(() => {
        client.logger.emit({
          message: `${getTargetMember(member)} não conseguiu criar o canal de voz dinâmico **${typeTitle}**!`,
          type: 'command',
          color: 'error',
        })
      })
    },
  ]
}
