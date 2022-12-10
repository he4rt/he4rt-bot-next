import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingAttendPost } from '@/types'
import { STAGE } from '@/defines/commands.json'
import { MEETING_OPTION } from '-/commands/stage_enter.json'
import { reply } from '@/utils'

export const useStageEnter = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE.TITLE)
    .setDescription(STAGE.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) => option.setName('reuniao').setDescription(MEETING_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      client.api.he4rt.events.meeting.attend
        .post<MeetingAttendPost>({
          discord_id: interaction.user.id,
        })
        .then(async ({ meeting_id }) => {
          await interaction.reply(`A reunião foi criada! O id da reunião é **${meeting_id}**!`)
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
