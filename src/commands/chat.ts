import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { Command } from '@/types'
import COMMANDS from '@/defines/commands.json'
import { getOption, reply } from '@/utils'
import CHAT from '@/defines/localisation/commands/chat.json'

export const useChat = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.CHAT.TITLE)
    .setDescription(COMMANDS.CHAT.DESCRIPTION)
    .setDMPermission(false)
    .addChannelOption((option) => option.setName('channel').setDescription(CHAT.CHANNEL_OPTION).setRequired(true))
    .addBooleanOption((option) => option.setName('stop').setDescription(CHAT.STOP_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels)

  return [
    data,
    async (interaction, client) => {
      const target = getOption(interaction, 'channel')
      const stop = getOption(interaction, 'stop')

      const channel = target.channel as TextChannel
      const guild = interaction.guild

      if (!channel) return

      channel.permissionOverwrites
        .edit(guild.id, { SendMessages: !stop.value as boolean })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).errorPermission()
        })
    },
  ]
}
