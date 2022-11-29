import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { BagdePOST, Command } from '@/types'
import { BAGDE_CREATE } from '@/defines/commands.json'
import { NAME_OPTION, DESCRIPTION_OPTION, IMAGE_OPTION, CODE_OPTION, ACTIVE_OPTION } from '-/commands/bagde_create.json'
import { getTargetMember, js, reply } from '@/utils'

export const useBadgeCreate = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BAGDE_CREATE.TITLE)
    .setDescription(BAGDE_CREATE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('nome').setDescription(NAME_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('descricao').setDescription(DESCRIPTION_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('imagem').setDescription(IMAGE_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('codigo').setDescription(CODE_OPTION).setRequired(true))
    .addBooleanOption((option) => option.setName('ativo').setDescription(ACTIVE_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const name = interaction.options.get('nome')
      const description = interaction.options.get('descricao')
      const image = interaction.options.get('imagem')
      const code = interaction.options.get('codigo')
      const active = interaction.options.get('ativo')

      client.api.he4rt.events.badges
        .post<BagdePOST>({
          name: name.value,
          description: description.value,
          image_url: image.value,
          redeem_code: code.value,
          active: active.value ? 1 : 0,
        } as BagdePOST)
        .then(async ({ name, description }) => {
          interaction.guild.roles
            .create({
              name,
              color: js().randomHex(),
              permissions: [],
            })
            .then(async () => {
              client.logger.emit({
                message: `${getTargetMember(
                  interaction.member as GuildMember
                )} criou o distintivo **${name}** com a descrição **${description}**`,
                type: 'role',
                color: 'success',
              })

              await reply(interaction).success()
            })
            .catch(() => {})
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
