import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { VERSION } from '@/defines/commands.json'
import { getBotVersion } from '@/utils'

export const useVersion = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(VERSION.TITLE)
    .setDescription(VERSION.DESCRIPTION)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      await interaction.reply({ content: `${getBotVersion()} | ${Math.round(client.ws.ping)}ms.`, ephemeral: true })
    },
  ]
}
