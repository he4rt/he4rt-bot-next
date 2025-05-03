import { CategoryChannel, GuildMember, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { DYNAMIC_VOICE_SIZE } from '@/defines/commands.json'
import { getOption, getChannel, reply, isPresentedMember } from '@/utils'
import { DYNAMIC_VOICE_MIN_SIZE, DYNAMIC_VOICE_MAX_SIZE } from '@/defines/values.json'
import { LIMIT_OPTION } from '-/commands/dynamic_voice.json'

export const useDynamicVoiceSize = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(DYNAMIC_VOICE_SIZE.TITLE)
    .setDescription(DYNAMIC_VOICE_SIZE.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName('limite')
        .setDescription(LIMIT_OPTION)
        .setRequired(true)
        .setMinValue(DYNAMIC_VOICE_MIN_SIZE)
        .setMaxValue(DYNAMIC_VOICE_MAX_SIZE),
    ) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const limit = getOption(interaction, 'limite')

      const member = interaction.member as GuildMember
      const voiceState = member?.voice

      if (!voiceState) {
        await reply(interaction).error()

        return
      }

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const channel = getChannel<VoiceChannel>({ client, id: voiceState.channelId })

      if (!channel?.parentId) {
        await reply(interaction).error()

        return
      }

      const category = getChannel<CategoryChannel>({ client, id: channel.parentId })

      if (!category || DYNAMIC_CATEGORY_CHANNEL.id !== category.id) {
        await reply(interaction).error()

        return
      }

      try {
        const fetched = [...(await channel.messages.fetch({ limit: 1 }))]

        const controller = fetched[0][1]

        const channel_id = controller.embeds[0].data.fields[0].value
        const author_id = controller.embeds[0].data.fields[1].value

        if (author_id !== member.id || channel_id !== channel.id) {
          await reply(interaction).error()

          return
        }

        const value = limit.value as number

        if (value > DYNAMIC_VOICE_MAX_SIZE || value < DYNAMIC_VOICE_MIN_SIZE) {
          await reply(interaction).error()

          return
        }

        channel
          .setUserLimit(value)
          .then(async () => {
            await reply(interaction).success()
          })
          .catch(async () => {
            await reply(interaction).error()
          })
      } catch (e) {
        await reply(interaction).error()

        return
      }
    },
  ]
}
