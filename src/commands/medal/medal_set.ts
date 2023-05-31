import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { MEDAL } from '@/defines/commands.json'
import { MEDAL_OPTION, DO_NOT_HAVE, ALREADY, SUCCESS } from '-/commands/medal.json'
import { hasRole, reply } from '../../utils'
import { getMedals, hasMedal } from '@/http/firebase'

export const useMedal = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(MEDAL.TITLE)
    .setDescription(MEDAL.DESCRIPTION)
    .setDMPermission(false)
    .addRoleOption((option) => option.setName('medalha').setDescription(MEDAL_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const medal = interaction.options.get('medalha')
      const medal_id = medal.value as string

      const userHasMedal = await hasMedal(client, { id: member.id, role_id: medal_id })

      if (!userHasMedal) {
        await interaction.reply({ content: DO_NOT_HAVE, ephemeral: true })

        return
      }

      if (hasRole(member, medal_id)) {
        await interaction.reply({ content: ALREADY, ephemeral: true })

        return
      }

      getMedals(client)
        .then(async (medals) => {
          await member.roles.add(medal_id).catch(() => {})
          await member.roles
            .remove(medals.filter(({ role_id }) => role_id !== medal_id).map((role) => role.role_id))
            .catch(() => {})

          await interaction.reply({ content: SUCCESS, ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
