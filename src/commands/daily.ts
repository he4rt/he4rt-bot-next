import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, DailyPOST } from '../types'
import { DAILY } from '../defines/commands.json'
import { ofetch } from 'ofetch'
import JSON_PARSE from 'destr'
import { isPrivileged } from './utils'

export const useDaily = (): Command => {
  const data = new SlashCommandBuilder().setName(DAILY.TITLE).setDescription(DAILY.DESCRIPTION).setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      ofetch<DailyPOST>(`${process.env.API_URL}/users/daily`, {
        parseResponse: JSON_PARSE,
        method: 'post',
        headers: { Authorization: `he4rt-${process.env.HE4RT_TOKEN as string}` },
        body: {
          discord_id: member.id,
          donator: isPrivileged(member),
        },
      })
        .then(async ({ data }) => {
          await interaction.reply({
            content: `Você ganhou ${data.points} HCoins de bônus diário! Para ver seu saldo, use o comando **/coins**`,
            ephemeral: true,
          })
        })
        .catch(async (e) => {
          console.log(e)
          await interaction.reply({
            content: 'Você já recebeu seu bônus diário! Tente novamente outro dia.',
            ephemeral: true,
          })
        })
    },
  ]
}
