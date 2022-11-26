import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { CLEAR } from '@/defines/commands.json'
import { QUANTITY_OPTION } from '-/commands/clear.json'
import { getOption, reply } from '@/utils'

export const useClear = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(CLEAR.TITLE)
    .setDescription(CLEAR.DESCRIPTION)
    .setDMPermission(false)
    .addNumberOption((option) => option.setName('quantidade').setDescription(QUANTITY_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

  return [
    data,
    async (interaction, client) => {
      const limit = getOption(interaction, 'quantidade')

      interaction.channel.messages
        .fetch({ limit: (limit.value as number) || 0 })
        .then(async (messages) => {
          messages.forEach(async (message) => {
            await message.delete().catch(() => {})
          })

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
