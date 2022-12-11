import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ONBOARDING_VOLUNTARY } from '@/defines/commands.json'
import { VOLUNTEER_CHANNEL, VOLUNTEER_ROLE } from '@/defines/ids.json'
import { getTargetMember, isPresentedMember, isVoluntaryMember, reply } from '@/utils'

export const useOnboardingVoluntary = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_VOLUNTARY.TITLE)
    .setDescription(ONBOARDING_VOLUNTARY.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const possibleVolunteer = interaction.member as GuildMember

      if (!isPresentedMember(possibleVolunteer)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      if (isVoluntaryMember(possibleVolunteer)) {
        await reply(interaction).error()

        return
      }

      // TODO: onboarding explanation and confirm

      // TODO: choice of ideal time (morning, afternoon, evening)

      await possibleVolunteer.roles.add(VOLUNTEER_ROLE.id)

      client.logger.emit({
        message: `${getTargetMember(possibleVolunteer)} se tornou um voluntário!`,
        type: 'command',
        color: 'success',
      })

      await interaction.reply({
        content: `**Agora você é um voluntário!** Fique atento ao canal <#${VOLUNTEER_CHANNEL.id}> para atender as pessoas que solicitarem ajuda.\n\nLembre-se de usar o comando **/onboarding-finalizar** quando acabar de ajuda alguém.`,
        ephemeral: true,
      })
    },
  ]
}
