import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, Maybe } from '@/types'
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
    .addNumberOption((option) => option.setName('tempo').setDescription(MEDAL_OPTION).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('membro') as GuildMember

      const medal = interaction.options.get('medalha')
      const medal_id = medal.value as string

      const time = interaction.options.get('tempo')

      const expires_at: Maybe<string> = !time?.value
        ? null
        : String(new Date().valueOf() + 60000 * 60 * 24 * (time.value as number))

      addUserInMedal(client, { id: member.id, role_id: medal_id, expires_at })
        .then(async () => {
          await interaction.reply({ content: SUCCESS, ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
