import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingEndPOST } from '@/types'
import { STAGE_FINISH } from '@/defines/commands.json'
import { MEETING_OPTION } from '-/commands/stage_finish.json'
import { getOption, reply } from '@/utils'

export const useStageFinish = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE_FINISH.TITLE)
    .setDescription(STAGE_FINISH.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) => option.setName('reuniao').setDescription(MEETING_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const meeting = getOption(interaction, 'reuniao')

      const meeting_id = meeting.value as number

      client.api.he4rt.events.meeting.end
        .post<MeetingEndPOST>({
          meeting_id,
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
