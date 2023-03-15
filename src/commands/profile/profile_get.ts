import { GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command, UserGET } from '@/types'
import { PROFILE } from '@/defines/commands.json'
import { COLORS, EXTENDED_PROFILE_LINK } from '@/defines/values.json'
import EMBED from '-/commands/profile.json'
import { LANGUAGE_NONE_ONE, NOT_FOUND, UF_NONE } from '-/defaults/display.json'
import {
  embedTemplate,
  getTargetMember,
  isHe4rtDelasMember,
  isPresentedMember,
  reply,
  validDisplayDevRoles,
  validDisplayEngRoles,
  validDisplaySpecialRoles,
} from '@/utils'

export const useProfileGet = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(PROFILE.TITLE)
    .setDescription(PROFILE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(EMBED.MEMBER_OPTION))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('membro')

      const target = (member || interaction.member) as GuildMember

      if (!isPresentedMember(target)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      client.api.he4rt
        .users
        .profile(target.id)
        .get<UserGET>()
        .then(async (obj) => {
          const fields = [
            [{ name: EMBED.EMBED_PROFILE_LINK, value: `${EXTENDED_PROFILE_LINK}${target.id}` }],
            [
              { name: EMBED.EMBED_NAME, value: obj.information.name, inline: true },
              { name: EMBED.EMBED_NICKNAME, value: obj.information.nickname || LANGUAGE_NONE_ONE, inline: true },
              { name: EMBED.EMBED_UF, value: obj.address.state || UF_NONE, inline: true },
            ],
            [
              { name: EMBED.EMBED_ABOUT, value: obj.information.about, inline: true },
              { name: EMBED.EMBED_GIT, value: obj.information.github_url, inline: true },
              { name: EMBED.EMBED_LINKEDIN, value: obj.information?.linkedin_url || NOT_FOUND, inline: true },
            ],
            [
              { name: EMBED.EMBED_LEVEL, value: `${obj.character.level}`, inline: true },
              {
                name: EMBED.EMBED_XP,
                inline: true,
                value: `${obj.character.experience}`,
              },
            ],
            [
              {
                name: EMBED.EMBED_LANGUAGES,
                value: validDisplayDevRoles(target),
              },
              {
                name: EMBED.EMBED_ENGLISH,
                value: validDisplayEngRoles(target),
                inline: false,
              },
              {
                name: EMBED.EMBED_SPECIAL,
                value: validDisplaySpecialRoles(target),
                inline: false,
              },
            ],
          ]

          const delas = isHe4rtDelasMember(target)

          const embed = embedTemplate({
            title: EMBED.EMBED_PROFILE,
            color: delas ? (COLORS.HE4RT_DELAS as HexColorString) : (COLORS.HE4RT as HexColorString),
            author: target.user,
            delas,
            fields,
          })

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          })
        })
        .catch(async (e) => {
          client.logger.emit({
            message: `${getTargetMember(target)} não conseguiu usar o comando **/perfil** de erro: ${e}`,
            type: 'he4rt-api',
            color: 'error',
          })

          await reply(interaction).error()
        })
    },
  ]
}
