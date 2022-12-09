import { GuildMember, SlashCommandBuilder, ThreadChannel } from 'discord.js'
import { Command } from '@/types'
import { FORUM_CLOSE } from '@/defines/commands.json'
import { MODERATION_ROLE } from '@/defines/ids.json'
import { CHANNEL_OPTION } from '-/commands/forum_close.json'
import { getForumChannel, getTargetMember, reply } from '@/utils'

export const useForumClose = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(FORUM_CLOSE.TITLE)
    .setDescription(FORUM_CLOSE.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      try {
        const channel = await getForumChannel(client)
        const { threads } = await channel.threads.fetch()

        const target = interaction.channel as ThreadChannel

        if (!target.isThread()) {
          await reply(interaction).error()

          return
        }

        const thread = threads.get(target.id)

        await thread.send(
          `<@&${MODERATION_ROLE.id}> o usuário <@${interaction.user.id}> está requisitando o fechamento deste post!`
        )

        await reply(interaction).success()

        await thread.edit({ archived: true, locked: true })

        client.logger.emit({
          message: `O canal de ajuda **${thread.name}** foi fechado por ${getTargetMember(
            interaction.member as GuildMember
          )} com sucesso!`,
          type: 'command',
          color: 'success',
        })
      } catch (e) {
        await reply(interaction).error()
      }
    },
  ]
}
