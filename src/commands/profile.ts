import { GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command, ProfileGET } from '@/types'
import { PROFILE } from '@/defines/commands.json'
import { COLORS } from '@/defines/values.json'
import EMBED from '@/defines/localisation/commands/profile.json'
import { LANGUAGE_NONE_ONE, NOT_FOUND } from '@/defines/localisation/defaults/display.json'
import {
  embedTemplate,
  isHe4rtDelasMember,
  isPresentedMember,
  reply,
  validDisplayDevRoles,
  validDisplayEngRoles,
} from '@/utils'

export const useProfile = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(PROFILE.TITLE)
    .setDescription(PROFILE.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      await client.api
        .users(member.id)
        .get<ProfileGET>()
        .then(async (user) => {
          const fields = [
            [
              { name: EMBED.EMBED_NAME, value: user.name, inline: true },
              { name: EMBED.EMBED_NICKNAME, value: user.nickname || LANGUAGE_NONE_ONE, inline: true },
            ],
            [
              { name: EMBED.EMBED_ABOUT, value: user.about, inline: true },
              { name: EMBED.EMBED_GIT, value: user.git, inline: true },
              { name: EMBED.EMBED_LINKEDIN, value: user?.linkedin || NOT_FOUND, inline: true },
            ],
            [
              { name: EMBED.EMBED_LEVEL, value: `${user.level}`, inline: true },
              {
                name: EMBED.EMBED_XP,
                inline: true,
                value: `${user.current_exp}`,
              },
            ],
            [
              {
                name: EMBED.EMBED_COINS,
                value: user.money,
                inline: true,
              },
            ],
            [
              {
                name: EMBED.EMBED_LANGUAGES,
                value: validDisplayDevRoles(member),
              },
              {
                name: EMBED.EMBED_ENGLISH,
                value: validDisplayEngRoles(member),
                inline: true,
              },
            ],
          ]

          const delas = isHe4rtDelasMember(member)

          const embed = embedTemplate({
            title: EMBED.EMBED_PROFILE,
            color: delas ? (COLORS.HE4RT_DELAS as HexColorString) : (COLORS.HE4RT as HexColorString),
            author: interaction.user,
            delas,
            fields,
          })

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
