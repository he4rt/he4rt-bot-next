import { GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command, IntroducePOST, UserGET } from '@/types'
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
        .users(target.id)
        .get<UserGET>()
        .then(async (user) => {
          const fields = [
            [{ name: EMBED.EMBED_PROFILE_LINK, value: `${EXTENDED_PROFILE_LINK}${target.id}` }],
            [
              { name: EMBED.EMBED_NAME, value: user.name, inline: true },
              { name: EMBED.EMBED_NICKNAME, value: user.nickname || LANGUAGE_NONE_ONE, inline: true },
              { name: EMBED.EMBED_UF, value: user.uf || UF_NONE, inline: true },
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
                inline: false,
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
            target: {
              user: interaction.user,
              icon: true,
            },
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

          // account error edge case
          client.api.he4rt
            .users()
            .post<IntroducePOST>({
              discord_id: target.id,
            })
            .catch(() => {})

          await reply(interaction).error()
        })
    },
  ]
}
