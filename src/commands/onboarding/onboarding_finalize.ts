import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ONBOARDING_FINALIZE } from '@/defines/commands.json'
import { CHAT_CHANNEL } from '@/defines/ids.json'
import { MEMBER_OPTION } from '-/commands/onboarding_finalize.json'
import { getChannel, isVoluntaryMember, reply } from '@/utils'

export const useOnboardingFinalize = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_FINALIZE.TITLE)
    .setDescription(ONBOARDING_FINALIZE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const volunteer = interaction.member as GuildMember
      const helped = interaction.options.getMember('membro') as GuildMember

      if (!isVoluntaryMember(volunteer)) {
        await reply(interaction).error()

        return
      }

      const channel = getChannel({ id: CHAT_CHANNEL.id, client })

      await channel.send(
        `<@${volunteer.id}> ajudou o usuário <@${helped.id}> pelo nosso sistema de *onboarding*!\n\nSe você é um membro novo e gostaria de conhecer mais sobre o servidor e sobre nossa iniciativa, use o comando **/onboarding-requisitar**!`
      )

      await reply(interaction).success()
    },
  ]
}
