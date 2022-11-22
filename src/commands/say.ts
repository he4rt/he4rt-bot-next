import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { Command } from '@/types'
import { SAY } from '@/defines/commands.json'
import { MESSAGE_OPTION, CHANNEL_OPTION } from '@/defines/localisation/commands/say.json'
import { getOption, reply } from '@/utils'

export const useSay = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(SAY.TITLE)
    .setDescription(SAY.DESCRIPTION)
    .setDMPermission(false)
    .addChannelOption((option) => option.setName('channel').setDescription(CHANNEL_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('message').setDescription(MESSAGE_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const target = getOption(interaction, 'channel')
      const { value } = getOption(interaction, 'message')

      if (!value || !target) {
        await reply(interaction).errorInMissingArgument()

        return
      }

      const channel = target.channel as TextChannel

      await channel.send(value as string)

      await reply(interaction).success()
    },
  ]
}
