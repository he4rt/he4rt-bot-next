import { SlashCommandBuilder } from 'discord.js'
import { Command, MeetingPOST } from '@/types'
import { STAGE_START } from '@/defines/commands.json'
import { MEETING_OPTION } from '-/commands/stage_enter.json'
import { getOption, reply } from '@/utils'

export const useStageStart = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE_START.TITLE)
    .setDescription(STAGE_START.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) => option.setName('reuniao').setDescription(MEETING_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const meeting = getOption(interaction, 'reuniao')

      const meeting_type_id = meeting.value as number

      client.api.he4rt.events.meeting
        .post<MeetingPOST>({
          meeting_type_id,
          discord_id: interaction.user.id,
        })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
