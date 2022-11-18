import { SlashCommandBuilder, RestOrArray, APIEmbedField } from 'discord.js'
import { Command, RankingGET } from '../types'
import { RANKING } from '../defines/commands.json'
import { COLORS } from '../defines/values.json'
import { ofetch } from 'ofetch'
import { embedTemplate } from './utils'
import { HexColorString } from 'discord.js'
import JSON_PARSE from 'destr'

export const useRanking = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(RANKING.TITLE)
    .setDescription(RANKING.DESCRIPTION)
    .setDMPermission(false)
    .addNumberOption((option) => option.setName('page').setDescription('Qual página deseja ver?').setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const page = (interaction.options.get('page')?.value as number) || 1

      ofetch<RankingGET>(`${process.env.API_URL}/ranking/general?page=${page}`, {
        parseResponse: JSON_PARSE,
        headers: { Authorization: process.env.HE4RT_TOKEN },
        method: 'GET',
      })
        .then(async ({ data: members }) => {
          const fields: RestOrArray<APIEmbedField> = []

          members.forEach((member, index) => {
            fields.push({
              name: `${index + 1 + (page - 1) * 10}° | ${(member.nickname as string) || 'Conta Excluída'}`,
              value: `Level: ${member.level} - Exp: ${member.current_exp}`,
              inline: false,
            })
          })

          if (fields.length === 0) {
            await interaction.reply({
              content: 'Este número de página não existe.',
              ephemeral: true,
            })

            return
          }

          const embed = embedTemplate({
            title: `🏆 » Ranking - Página ${page}`,
            color: COLORS.WARNING as HexColorString,
            fields: [fields],
          })

          await interaction.reply({ embeds: [embed], ephemeral: true })
        })
        .catch(async () => {
          await interaction.reply({
            content: 'Um erro inesperado ocorreu. Tente novamente mais tarde!',
            ephemeral: true,
          })
        })
    },
  ]
}
