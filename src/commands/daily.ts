import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, DailyPOST } from '@/types'
import { DAILY } from '@/defines/commands.json'
import { isPresentedMember, reply } from '@/utils'
import { HCOINS_ERROR } from '-/commands/daily.json'

export const useDaily = (): Command => {
  const data = new SlashCommandBuilder().setName(DAILY.TITLE).setDescription(DAILY.DESCRIPTION).setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      client.api.he4rt.characters
        .discord(member.id)
        .daily.post<DailyPOST>()
        .then(async () => {
          await reply(interaction).success()
          /*
          await interaction.reply({
            content: replaceDefineString(HCOINS_SUCCESS, String(points)),
            ephemeral: true,
          })
          */
        })
        .catch(async () => {
          await interaction.reply({
            content: HCOINS_ERROR,
            ephemeral: true,
          })
        })
    },
  ]
}
