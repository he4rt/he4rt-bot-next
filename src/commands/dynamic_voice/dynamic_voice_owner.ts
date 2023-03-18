import { CategoryChannel, GuildMember, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { Command } from '@/types'
import { DYNAMIC_VOICE_OWNER } from '@/defines/commands.json'
import { USER_OPTION } from '-/commands/dynamic_voice.json'
import { dynamicVoiceEmbedTemplate, getChannel, isPresentedMember, reply } from '@/utils'
import { DYNAMIC_CATEGORY_CHANNEL } from '@/defines/ids.json'

export const useDynamicVoiceOwner = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(DYNAMIC_VOICE_OWNER.TITLE)
    .setDescription(DYNAMIC_VOICE_OWNER.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('usuario').setDescription(USER_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const target = interaction.options.getMember('usuario') as GuildMember
      const targetState = target?.voice
      const act = interaction.member as GuildMember
      const actState = act?.voice

      if (!targetState || !actState || targetState.channelId !== actState.channelId) {
        await reply(interaction).error()

        return
      }

      if (target.id === act.id) {
        await reply(interaction).error()

        return
      }

      if (!isPresentedMember(target) || !isPresentedMember(act)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const channel = getChannel<VoiceChannel>({ client, id: targetState.channelId })

      if (!channel?.parentId) {
        await reply(interaction).error()

        return
      }

      const category = getChannel<CategoryChannel>({ client, id: channel.parentId })

      if (!category || DYNAMIC_CATEGORY_CHANNEL.id !== category.id) {
        await reply(interaction).error()

        return
      }

      const messages = [...(await channel.messages.fetch())]

      if (messages.length === 0) {
        await reply(interaction).error()

        return
      }

      const controller = messages[0][1]

      const channel_id = controller.embeds[0].data.fields[0].value
      const author_id = controller.embeds[0].data.fields[1].value

      if (author_id !== act.id || channel_id !== channel.id) {
        await reply(interaction).error()

        return
      }

      const message = await dynamicVoiceEmbedTemplate(channel, target)

      await controller
        .edit(message)
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
