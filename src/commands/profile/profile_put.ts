import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, IntroducePUT } from '@/types'
import { PROFILE_PUT } from '@/defines/commands.json'
import { NAME_OPTION, NICKNAME_OPTION, ABOUT_OPTION, GIT_OPTION, LINKEDIN_OPTION } from '-/commands/profile_put.json'
import { isPresentedMember, reply } from '@/utils'

export const useProfilePut = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(PROFILE_PUT.TITLE)
    .setDescription(PROFILE_PUT.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('nome').setDescription(NAME_OPTION))
    .addStringOption((option) => option.setName('nick').setDescription(NICKNAME_OPTION))
    .addStringOption((option) => option.setName('sobre').setDescription(ABOUT_OPTION))
    .addStringOption((option) => option.setName('git').setDescription(GIT_OPTION))
    .addStringOption((option) => option.setName('linkedin').setDescription(LINKEDIN_OPTION))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const name = interaction.options.get('nome')
      const nickname = interaction.options.get('nick')
      const about = interaction.options.get('sobre')
      const git = interaction.options.get('git')
      const linkedin = interaction.options.get('linkedin')

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const body = {}

      if (name?.value) body['name'] = name.value
      if (nickname?.value) body['nickname'] = nickname.value
      if (about?.value) body['about'] = about.value
      if (git?.value) body['git'] = git.value
      if (linkedin?.value) body['linkedin'] = linkedin.value

      client.api.he4rt
        .users(member.id)
        .put<IntroducePUT>(body)
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
