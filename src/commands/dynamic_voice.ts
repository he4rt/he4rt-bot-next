import { CategoryChannel, ChannelType, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { DYNAMIC_VOICE } from '@/defines/commands.json'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { DYNAMIC_VOICE_REASON } from '@/defines/values.json'
import { TYPE_OPTION, LIMIT_OPTION, MIN_SIZE, MAX_SIZE } from '-/commands/dynamic_voice.json'
import { getGuild, getOption, isPresentedMember, reply } from '@/utils'

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
          { name: '🏢 Trabalho', value: 4 }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('limite')
        .setDescription(LIMIT_OPTION)
        .setRequired(true)
        .setMinValue(MIN_SIZE)
        .setMaxValue(MAX_SIZE)
    )

  const getType = (value: number): string => {
    return {
      0: '🗣 Only English',
      1: '👥 Novas Amizades',
      2: '👋 Novato',
      3: '🎓 Mentoria',
      4: '🏢 Trabalho',
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
        message: `O canal de voz dinâmico **${voice.id}** foi criado automaticamente com sucesso!`,
        type: 'command',
        color: 'success',
      })

      await voice.send(`<@${member.id}> aqui está o seu novo canal de voz!`).catch(() => {})

      await interaction.reply({ content: invite.url, ephemeral: true })
    },
  ]
}
