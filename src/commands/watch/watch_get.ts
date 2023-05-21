import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { WATCH_LIST } from '@/defines/commands.json'
import { getWatchedUsers } from '@/http/firebase'
import { getUserTemplate, reply } from '@/utils'

export const useWatchList = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(WATCH_LIST.TITLE)
    .setDescription(WATCH_LIST.DESCRIPTION)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      getWatchedUsers(client)
        .then(async (users) => {
          const content = users
            .map(
              (user) =>
                `Autor: ${getUserTemplate(user.author_id)} | Alvo: ${getUserTemplate(user.id)} | Razão: **${
                  user.reason
                }**\n`
            )
            .reduce((str, item) => (str += item), '**Lista de Observados**: \n\n')

          interaction.reply({ content, ephemeral: true }).catch(() => {})
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
