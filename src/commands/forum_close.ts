import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { FORUM_CLOSE } from '@/defines/commands.json'
import { getForumChannel, getTargetMember, reply } from '@/utils'

export const useForumClose = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(FORUM_CLOSE.TITLE)
    .setDescription(FORUM_CLOSE.DESCRIPTION)
    .setDMPermission(false)
    .addChannelOption((option) => option.setName('canal').setDescription('teste').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)

  return [
    data,
    async (interaction, client) => {
      const target = interaction.options.get('canal')

      try {
        const channel = await getForumChannel(client)
        const { threads } = await channel.threads.fetch()

        const thread = threads.get(target.value as string)
        await thread.edit({ locked: true, archived: true })
        thread.appliedTags = []

        client.logger.emit({
          message: `O canal de ajuda **${thread.name}** foi fechado por ${getTargetMember(
            interaction.member as GuildMember
          )} com sucesso!`,
          type: 'command',
          color: 'success',
        })

        await reply(interaction).success()
      } catch (e) {
        await reply(interaction).error()
      }
    },
  ]
}
