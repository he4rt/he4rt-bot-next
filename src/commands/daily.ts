import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, DailyPOST } from '@/types'
import { DAILY } from '@/defines/commands.json'
import { isPrivileged } from '@/utils'

export const useDaily = (): Command => {
  const data = new SlashCommandBuilder().setName(DAILY.TITLE).setDescription(DAILY.DESCRIPTION).setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      client.api.users
        .daily()
        .post<DailyPOST>({
          donator: isPrivileged(member),
          discord_id: member.id,
        })
        .then(async ({ data }) => {
          await interaction.reply({
            content: `Você ganhou **${data.points}** HCoins de bônus diário! Para ver seu saldo, use o comando **/perfil**.`,
            ephemeral: true,
          })
        })
        .catch(async () => {
          await interaction.reply({
            content: 'Você já recebeu seu bônus diário! Tente novamente outro dia.',
            ephemeral: true,
          })
        })
    },
  ]
}
