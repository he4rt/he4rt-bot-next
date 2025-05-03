import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { ANNOUNCE } from '@/defines/commands.json'
import { ADVERTS_CHANNEL } from '@/defines/ids.json'
import { TEXT_OPTION, EMBED_CONTENT } from '-/commands/announce.json'
import { getChannel, reply, sendMessageToChannel } from '@/utils'

export const useAnnounce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ANNOUNCE.TITLE)
    .setDescription(ANNOUNCE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('texto').setDescription(TEXT_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const text = interaction.options.get('texto')

      const channel = getChannel({ id: ADVERTS_CHANNEL.id, client })

      sendMessageToChannel(channel, { content: `${EMBED_CONTENT} ${text.value as string}` })

      await reply(interaction).success()
    },
  ]
}
