import { ForumChannel, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { CLOSE_FORUM } from '@/defines/commands.json'
import { FORUM_CHANNEL } from '@/defines/ids.json'
import { reply } from '@/utils'

export const useForumClose = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(CLOSE_FORUM.TITLE)
    .setDescription(CLOSE_FORUM.DESCRIPTION)
    .setDMPermission(false)
    .addChannelOption((option) => option.setName('canal').setDescription('teste').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)

  return [
    data,
    async (interaction, client) => {
      const target = interaction.options.get('canal')

      try {
        const channel = (await client.channels.fetch(FORUM_CHANNEL.id)) as ForumChannel
        const { threads } = await channel.threads.fetch()

        const thread = threads.get(target.value as string)
        await thread.edit({ locked: true, archived: true })
        thread.appliedTags = []

        await reply(interaction).success()
      } catch (e) {
        await reply(interaction).error()
      }
    },
  ]
}
