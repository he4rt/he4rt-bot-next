import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { FORUM_OPEN } from '@/defines/commands.json'
import { TITLE_OPTION, DESCRIPTION_OPTION } from '-/commands/forum_create.json'
import { UNSOLVED_TAG } from '@/defines/ids.json'
import { getForumChannel, getOption, getTargetMember, reply } from '@/utils'

export const useForumCreate = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(FORUM_OPEN.TITLE)
    .setDescription(FORUM_OPEN.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('titulo').setDescription(TITLE_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('descricao').setDescription(DESCRIPTION_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const title = getOption(interaction, 'titulo')
      const description = getOption(interaction, 'descricao')

      const name = `${interaction.user.username} » ${title.value as string}`

      try {
        const channel = await getForumChannel(client)

        await channel.threads.create({
          name,
          message: { content: description.value as string },
          appliedTags: [UNSOLVED_TAG.id],
        })

        client.logger.emit({
          message: `O canal de ajuda **${name}** foi criado com sucesso!`,
          type: 'command',
          color: 'info',
        })

        await reply(interaction).success()
      } catch (e) {
        client.logger.emit({
          message: `${getTargetMember(
            interaction.member as GuildMember
          )} não conseguiu criar o canal de ajuda **${name}**!`,
          type: 'command',
          color: 'error',
        })

        await reply(interaction).error()
      }
    },
  ]
}
