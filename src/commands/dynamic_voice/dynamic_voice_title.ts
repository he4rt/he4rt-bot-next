import { CategoryChannel, GuildMember, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { DYNAMIC_VOICE_TITLE } from '@/defines/commands.json'
import { TYPE_OPTION, STUDYING_TITLE_OPTION } from '-/commands/dynamic_voice.json'
import { getChannel, getOption, getOptionType, isPresentedMember, reply } from '@/utils'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'
import { DYNAMIC_VOICE_OPTIONS, DYNAMIC_VOICE_STUDYING_OPTIONS } from '@/defines/values.json'

export const useDynamicVoiceTitle = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(DYNAMIC_VOICE_TITLE.TITLE)
    .setDescription(DYNAMIC_VOICE_TITLE.DESCRIPTION)
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
        .setName('estudando-titulo')
        .setDescription(STUDYING_TITLE_OPTION)
        .addChoices(...DYNAMIC_VOICE_STUDYING_OPTIONS),
    ) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const target = getOption(interaction, 'tipo')?.value as number
      const optional_study = getOption(interaction, 'estudando-titulo')

      const act = interaction.member as GuildMember
      const actState = act?.voice

      if (!isPresentedMember(act)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      if (!actState) {
        await reply(interaction).error()

        return
      }

      const channel = getChannel<VoiceChannel>({ client, id: actState.channelId })

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

        if (author_id !== act.id || channel_id !== channel.id) {
          await reply(interaction).error()

          return
        }

        const name =
          optional_study?.value && target === 5
            ? `📖 ${getOptionType(DYNAMIC_VOICE_STUDYING_OPTIONS, optional_study.value as number)}`
            : getOptionType(DYNAMIC_VOICE_OPTIONS, target)

        channel
          .edit({ name })
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
