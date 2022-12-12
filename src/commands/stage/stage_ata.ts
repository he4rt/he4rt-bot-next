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
    .addIntegerOption((option) => option.setName('reuniao').setDescription(MEETING_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('ata').setDescription(ATA_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const ATA = getOption(interaction, 'ata')
      const meeting = getOption(interaction, 'reuniao')

      if (!isATAMember(interaction.member as GuildMember)) {
        await interaction.reply({ content: `Apenas o escrivão pode utilizar este comando!`, ephemeral: true })

        return
      }

      const content = ATA.value as string
      const id = meeting.value as number

      if (content.length >= DISCORD_MESSAGE_LIMIT) {
        await interaction.reply({
          content: `O seu texto ultrapassa o limite do discord (${DISCORD_MESSAGE_LIMIT} caracteres) e por isso foi desconsiderado!`,
          ephemeral: true,
        })

        return
      }

      client.api.he4rt.events
        .meeting(id)
        .subject.patch<MeetingPATCH>({
          content,
        })
        .then(async ({ id }) => {
          await interaction.reply({
            content: `ATA foi submetida com sucesso para a reunião de id **${id}**!`,
            ephemeral: true,
          })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
