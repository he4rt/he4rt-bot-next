import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingAttendPost } from '@/types'
import { STAGE } from '@/defines/commands.json'
import { MEETING_OPTION } from '-/commands/stage_enter.json'
import { getOption, reply } from '@/utils'

export const useStageEnter = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE.TITLE)
    .setDescription(STAGE.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) => option.setName('reuniao').setDescription(MEETING_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const meeting = getOption(interaction, 'reuniao')

      const meeting_id = meeting.value as number

      console.log(meeting_id)

      client.api.he4rt.events.meeting.attend
        .post<MeetingAttendPost>({
          discord_id: interaction.user.id,
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
