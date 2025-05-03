import { SlashCommandBuilder, RestOrArray, APIEmbedField, GuildMember } from 'discord.js'
import { Command, CommandSet, RankingGET } from '@/types'
import { RANKING } from '@/defines/commands.json'
import { PAGE_OPTION, NULL_ACCOUNT, EMBED_TITLE } from '-/commands/ranking.json'
import { COLORS } from '@/defines/values.json'
import { embedTemplate, isPresentedMember, reply } from '@/utils'
import { HexColorString } from 'discord.js'

export const useRanking = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(RANKING.TITLE)
    .setDescription(RANKING.DESCRIPTION)
    .setDMPermission(false)
    .addNumberOption((option) => option.setName('pagina').setDescription(PAGE_OPTION).setRequired(true)) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember
      const page = (interaction.options.get('pagina')?.value as number) || 1

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      client.api.he4rt.ranking.leveling
        .get<RankingGET>({
          page,
        })
        .then(async ({ data: members }) => {
          const fields: RestOrArray<APIEmbedField> = []

          members.forEach((member) => {
            fields.push({
              name: `${member.ranking}° | ${(member.user?.username as string) || NULL_ACCOUNT}`,
              value: `Level: ${member.level} - Exp: ${member.experience}`,
              inline: false,
            })
          })

          if (fields.length === 0) {
            await reply(interaction).errorPaginationFail()

            return
          }

          const embed = embedTemplate({
            title: `${EMBED_TITLE}${page}`,
            color: COLORS.WARNING as HexColorString,
            fields: [fields],
          })

          await interaction.reply({ embeds: [embed], ephemeral: true })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
