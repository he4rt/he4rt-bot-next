import { GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command, ProfileGET } from '@/types'
import { PROFILE } from '@/defines/commands.json'
import { COLORS } from '@/defines/values.json'
import { embedTemplate, isHe4rtDelasMember, validDisplayDevRoles, validDisplayEngRoles } from '@/utils'
import { ofetch } from 'ofetch'
import JSON_PARSE from 'destr'

export const useProfile = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(PROFILE.TITLE)
    .setDescription(PROFILE.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      ofetch<ProfileGET>(`${process.env.API_URL}/users/${member.id}`, {
        parseResponse: JSON_PARSE,
        headers: { Authorization: process.env.HE4RT_TOKEN },
        method: 'GET',
      })
        .then(async (user) => {
          const fields = [
            [
              { name: '**Nome:**', value: user.name, inline: true },
              { name: '**Nickname:**', value: user.nickname || 'Nenhum', inline: true },
            ],
            [
              { name: '**Sobre:**', value: user.about, inline: true },
              { name: '**GIT:**', value: user.git, inline: true },
            ],
            [
              { name: '**Nível:**', value: `${user.level}`, inline: true },
              {
                name: '**EXP Atual:**',
                inline: true,
                value: `${user.current_exp}`,
              },
            ],
            [
              {
                name: `**HCoins:**`,
                value: user.money,
                inline: true,
              },
            ],
            [
              {
                name: '**Linguagens:**',
                value: validDisplayDevRoles(member),
              },
              {
                name: '**Nível de Inglês:**',
                value: validDisplayEngRoles(member),
                inline: true,
              },
            ],
          ]

          const embed = embedTemplate({
            title: 'Perfil',
            color: isHe4rtDelasMember(member)
              ? (COLORS.HE4RT_DELAS as HexColorString)
              : (COLORS.HE4RT as HexColorString),
            author: interaction.user,
            fields,
          })

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          })
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
