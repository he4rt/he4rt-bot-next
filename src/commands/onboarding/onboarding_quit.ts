import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ONBOARDING_QUIT } from '@/defines/commands.json'
import { VOLUNTEER_ROLE } from '@/defines/ids.json'
import { getTargetMember, isVoluntaryMember, reply } from '@/utils'

export const useOnboardingQuit = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_QUIT.TITLE)
    .setDescription(ONBOARDING_QUIT.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const volunteer = interaction.member as GuildMember

      if (!isVoluntaryMember(volunteer)) {
        await reply(interaction).error()

        return
      }

      await volunteer.roles.remove(VOLUNTEER_ROLE.id)

      client.logger.emit({
        message: `${getTargetMember(volunteer)} desistiu de ser um voluntário!`,
        type: 'command',
        color: 'warning',
      })

      await reply(interaction).success()
    },
  ]
}
