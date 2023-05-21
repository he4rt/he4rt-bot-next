import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { MEDAL_ADD } from '@/defines/commands.json'
import { MEDAL_OPTION, MEMBER_OPTION, DO_NOT_HAVE, SUCCESS } from '-/commands/medal.json'
import { reply } from '../../utils'
import { addUserInMedal, hasMedal } from '@/http/firebase'

export const useMedalAdd = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(MEDAL_ADD.TITLE)
    .setDescription(MEDAL_ADD.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addRoleOption((option) => option.setName('medalha').setDescription(MEDAL_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('membro') as GuildMember

      const medal = interaction.options.get('medalha')
      const medal_id = medal.value as string

      const userHasMedal = await hasMedal(client, { id: member.id, role_id: medal_id })

      if (userHasMedal) {
        await interaction.reply({ content: DO_NOT_HAVE, ephemeral: true })
        
        return
      }

      addUserInMedal(client, { id: member.id, role_id: medal_id })
        .then(async () => {
          await interaction.reply({ content: SUCCESS, ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
