import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, MeetingPATCH } from '@/types'
import { STAGE_ATA } from '@/defines/commands.json'
import { DISCORD_MESSAGE_LIMIT } from '@/defines/values.json'
import { ATA_OPTION, MEETING_OPTION } from '-/commands/stage_ata.json'
import { getOption, isATAMember, reply } from '@/utils'

export const useStageATA = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(STAGE_ATA.TITLE)
    .setDescription(STAGE_ATA.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) => option.setName('reuniao').setDescription(ATA_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('ata').setDescription(MEETING_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const ATA = getOption(interaction, 'ata')
      const meeting = getOption(interaction, 'meeting')

      if (!isATAMember(interaction.member as GuildMember)) {
        await reply(interaction).error()

        return
      }

      const content = ATA.value as string
      const id = meeting.value as number

      if (content.length >= DISCORD_MESSAGE_LIMIT) {
        await reply(interaction).error()

        return
      }

      client.api.he4rt.events
        .meeting(id)
        .subject.patch<MeetingPATCH>({
          content,
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
