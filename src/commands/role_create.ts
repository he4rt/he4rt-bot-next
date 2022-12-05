import { HexColorString, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ROLE_CREATE } from '@/defines/commands.json'
import { getGuild, isHex, reply } from '@/utils'
import { HEX_OPTION, NAME_OPTION } from '-/commands/role_create.json'
import { HEX_ERROR, HEX_ERROR_IN_SPECIFIC_COLOR } from '-/commands/color.json'

export const useRoleCreate = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ROLE_CREATE.TITLE)
    .setDescription(ROLE_CREATE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('nome').setDescription(NAME_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('hex').setDescription(HEX_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const guild = getGuild(client)

      const name = interaction.options.get('nome')
      const color = interaction.options.get('hex')

      if (!isHex(color.value as string)) {
        await interaction.reply({ content: HEX_ERROR, ephemeral: true })

        return
      }

      if (color.value === '#000000') {
        await interaction.reply({ content: HEX_ERROR_IN_SPECIFIC_COLOR, ephemeral: true })

        return
      }

      guild.roles
        .create({
          name: name.value as string,
          color: color.value as HexColorString,
        })
        .then(async ({ id, name }) => {
          client.logger.emit({
            type: 'role',
            color: 'success',
            message: `O cargo **${id} - ${name}** foi criado com sucesso!`,
          })

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
