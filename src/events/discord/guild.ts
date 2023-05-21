import { He4rtClient, IntroducePOST } from '@/types'
import { getTargetMember, openAndSendMessageInDm } from '@/utils'
import { GuildMember, PartialGuildMember } from 'discord.js'
import { INITIAL_MESSAGE } from '-/events/guild_enter.json'
import { createUser, deleteUser } from '@/http/firebase'

export const sendDmToNewUser = async (client: He4rtClient, member: GuildMember) => {
  await openAndSendMessageInDm(client, member, INITIAL_MESSAGE, true)
}

export const deletePossibleUserInServerLeave = (client: He4rtClient, member: GuildMember | PartialGuildMember) => {
  deleteUser(client, { id: member.id }).catch(() => {})
}

export const createUserInServerEnter = (client: He4rtClient, member: GuildMember) => {
  createUser(client, { id: member.id }).catch(() => {
    client.logger.emit({
      type: 'http',
      color: 'warning',
      message: `${getTargetMember(member)} já e cadastrado no firestore.`,
    })
  })

  client.api.he4rt.providers.discord
    .post<IntroducePOST>({
      provider_id: member.id,
      username: `${member?.nickname ?? member.user.username}-${member.user.discriminator}`,
    })
    .then(() => {
      client.logger.emit({
        type: 'http',
        color: 'info',
        message: `${getTargetMember(member)} entrou no servidor e teve a sua conta criada.`,
      })
    })
    .catch(() => {})
}
