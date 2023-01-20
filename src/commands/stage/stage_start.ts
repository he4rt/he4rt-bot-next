import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingPOST } from '@/types'
import { STAGE_START } from '@/defines/commands.json'
import { MEETING_OPTION } from '-/commands/stage_start.json'
import { getOption, getTargetMember, reply } from '@/utils'

export const useStageStart = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE_START.TITLE)
    .setDescription(STAGE_START.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName('reuniao')
        .setDescription(MEETING_OPTION)
        .setRequired(true)
        .addChoices({ name: 'Reunião Semanal', value: 1 }, { name: 'Reunião das Primas', value: 2 })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.member as GuildMember
      const meeting = getOption(interaction, 'reuniao')

      const meeting_type_id = meeting.value as number

      client.api.he4rt.events.meeting
        .post<MeetingPOST>({
          meeting_type_id,
          discord_id: interaction.user.id,
        })
        .then(async ({ id }) => {
          client.logger.emit({
            message: `${getTargetMember(author)} iniciou uma reunião semanal de id **${id}**!`,
            type: 'command',
            color: 'success',
          })

          await interaction.reply({ content: `A reunião foi criada! O id da reunião é **${id}**!`, ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
