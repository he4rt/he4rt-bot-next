import { CategoryChannel, ChannelType, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { DYNAMIC_VOICE } from '@/defines/commands.json'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { TYPE_OPTION, LIMIT_TYPE } from '-/commands/dynamic_voice.json'
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
          { name: '🏁 Novato', value: 1 },
          { name: '🎓 Mentoria', value: 2 }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('limite')
        .setDescription(LIMIT_TYPE)
        .setRequired(true)
        .addChoices(
          { name: '2️⃣ Sala Pequena', value: 2 },
          { name: '5️⃣ Sala Média', value: 5 },
          { name: '🔟 Sala Grande', value: 10 }
        )
    )

  const getType = (value: number) => {
    return {
      0: '🗣 Only English',
      1: '🏁 Novato',
      2: '🎓 Mentoria',
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
      })

      const invite = await voice.createInvite({
        unique: true,
        temporary: true,
        maxUses: 1,
      })

      await interaction.reply({ content: invite.url, ephemeral: true })
    },
  ]
}
