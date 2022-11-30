import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { BadgePOST, Command } from '@/types'
import { BADGE_CREATE } from '@/defines/commands.json'
import { NAME_OPTION, DESCRIPTION_OPTION, IMAGE_OPTION, CODE_OPTION, ACTIVE_OPTION } from '-/commands/badge_post.json'
import { getTargetMember, reply } from '@/utils'

export const useBadgePost = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BADGE_CREATE.TITLE)
    .setDescription(BADGE_CREATE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('nome').setDescription(NAME_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('descricao').setDescription(DESCRIPTION_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('imagem').setDescription(IMAGE_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('codigo').setDescription(CODE_OPTION).setRequired(true))
    .addBooleanOption((option) => option.setName('ativo').setDescription(ACTIVE_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const name = interaction.options.get('nome')
      const description = interaction.options.get('descricao')
      const image = interaction.options.get('imagem')
      const code = interaction.options.get('codigo')
      const active = interaction.options.get('ativo')

      client.api.he4rt.events.badges
        .post<BadgePOST>({
          name: name.value,
          description: description.value,
          image_url: image.value,
          redeem_code: code.value,
          active: active.value ? 1 : 0,
        } as BadgePOST)
        .then(async ({ name, description }) => {
          client.logger.emit({
            message: `${getTargetMember(
              interaction.member as GuildMember
            )} criou o distintivo **${name}** com a descrição **${description}**`,
            type: 'he4rt-api',
            color: 'success',
          })

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
