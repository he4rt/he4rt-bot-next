import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { UNBAN } from '@/defines/commands.json'
import { PUNISHMENTS_CHANNEL } from '@/defines/ids.json'
import { embedTemplate, getChannel } from '@/utils'

export const useUnban = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(UNBAN.TITLE)
    .setDescription(UNBAN.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('member').setDescription('Usuário a ser desbanido.').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('Texto que irá aparecer no anúncio').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user

      const user = interaction.options.getUser('member')
      const reason = interaction.options.get('reason')

      if (!user || !reason) {
        return
      }

      try {
        await interaction?.guild?.members.unban(user)
      } catch (e) {
        await interaction.reply({ content: 'O usuário em questão não pode ser desbanido!', ephemeral: true })

        return
      }

      const embed = embedTemplate({
        title: '``🚔`` » Revogado',
        target: {
          user,
          icon: true,
        },
        author,
        fields: [
          [
            { name: '``👤`` **Usuário desbanido:**', value: `**${user!.username}**` },
            { name: '``📄`` **Tipo:**', value: 'Banimento' },
            { name: '``📣`` **Motivo:**', value: (reason.value as string) || 'Não Inferido.' },
          ],
        ],
      })

      const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

      await channel?.send({ content: `Usuário ${user.id} Desbanido!`, embeds: [embed] })

      await interaction.reply({ content: 'Sucesso!', ephemeral: true })
    },
  ]
}
