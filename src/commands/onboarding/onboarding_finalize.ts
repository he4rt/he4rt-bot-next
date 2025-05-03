import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { ONBOARDING_FINALIZE } from '@/defines/commands.json'
import { CHAT_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { MEMBER_OPTION } from '-/commands/onboarding_finalize.json'
import { getChannel, getOption, isVoluntaryMember, reply, sendMessageToChannel } from '@/utils'

export const useOnboardingFinalize = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_FINALIZE.TITLE)
    .setDescription(ONBOARDING_FINALIZE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true)) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const volunteer = interaction.member as GuildMember
      const helpedOption = getOption(interaction, 'membro')
      const helped = interaction.guild.members.cache.get(helpedOption.user.id) as GuildMember

      if (!isVoluntaryMember(volunteer)) {
        await reply(interaction).error()
        return
      }

      const channel = getChannel({ id: CHAT_CHANNEL.id, client })

      const message = await sendMessageToChannel(
        channel,
        `<@${volunteer.id}> ajudou o usuário <@${helped.id}> pelo nosso sistema de acolhimento à novos membros!\n\nSe você é um membro novo e gostaria de conhecer mais sobre o servidor e sobre nossa iniciativa, use o comando **/onboarding** para conhecer este sistema!`,
      )

      if (message) {
        await message.react(HE4RT_EMOJI_ID).catch(() => {})
      }

      await reply(interaction).success()
    },
  ]
}
