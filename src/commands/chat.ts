import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { Command } from '@/types'
import COMMANDS from '@/defines/commands.json'
import { PRESENTED_ROLE } from '@/defines/ids.json'
import { getOption, reply } from '@/utils'
import CHAT from '-/commands/chat.json'

export const useChat = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.CHAT.TITLE)
    .setDescription(COMMANDS.CHAT.DESCRIPTION)
    .setDMPermission(false)
    .addChannelOption((option) => option.setName('canal').setDescription(CHAT.CHANNEL_OPTION).setRequired(true))
    .addBooleanOption((option) => option.setName('parar').setDescription(CHAT.STOP_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

  return [
    data,
    async (interaction, client) => {
      const target = getOption(interaction, 'canal')
      const stop = getOption(interaction, 'parar')

      const channel = target.channel as TextChannel
      const guild = interaction.guild

      if (!channel) return

      const value = stop.value as boolean

      channel.permissionOverwrites
        .edit(guild.id, { SendMessages: value })
        .then(async () => {
          channel.permissionOverwrites
            .edit(PRESENTED_ROLE.id, { SendMessages: value })
            .then(async () => {
              await reply(interaction).success()
            })
            .catch(async () => {
              await reply(interaction).errorPermission()
            })
        })
        .catch(async () => {
          await reply(interaction).errorPermission()
        })
    },
  ]
}
