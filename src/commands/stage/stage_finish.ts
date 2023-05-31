import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingEndPOST } from '@/types'
import { STAGE_FINISH } from '@/defines/commands.json'
import { reply } from '@/utils'

export const useStageFinish = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE_FINISH.TITLE)
    .setDescription(STAGE_FINISH.DESCRIPTION)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      client.api.he4rt.events.discord.meeting.end
        .post<MeetingEndPOST>({
          provider_id: interaction.user.id,
        })
        .then(async ({ message }) => {
          await interaction.reply({ content: message, ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
