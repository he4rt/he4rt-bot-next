import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ROLE_DELETE } from '@/defines/commands.json'
import { ROLE_OPTION } from '-/commands/role_delete.json'
import { reply } from '@/utils'

export const useRoleDelete = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ROLE_DELETE.TITLE)
    .setDescription(ROLE_DELETE.DESCRIPTION)
    .setDMPermission(false)
    .addRoleOption((option) => option.setName('cargo').setDescription(ROLE_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const role = interaction.options.get('cargo')

      interaction.guild.roles
        .delete(role.value as string)
        .then(async () => {
          client.logger.emit({
            type: 'role',
            color: 'success',
            message: `O cargo **${role.value}** foi deletado com sucesso!`,
          })

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
