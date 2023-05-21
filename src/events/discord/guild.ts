import { He4rtClient, IntroducePOST } from '@/types'
import { getTargetMember, openAndSendMessageInDm } from '@/utils'
import { GuildMember, PartialGuildMember } from 'discord.js'
import { INITIAL_MESSAGE } from '-/events/guild_enter.json'
import { createUser, deleteUser } from '@/http/firebase'
import { REPORT_CHANNEL } from '@/defines/ids.json'

export const sendDmToNewUser = async (client: He4rtClient, member: GuildMember) => {
  await openAndSendMessageInDm(client, member, INITIAL_MESSAGE, true)
}

export const userLeave = (client: He4rtClient, member: GuildMember | PartialGuildMember) => {
  client.logger.emit({
    type: 'event',
    color: 'warning',
    message: `${getTargetMember(member as GuildMember)} saiu do servidor!.`,
    customChannelId: REPORT_CHANNEL.id,
  })

  deleteUser(client, { id: member.id }).catch(() => {})
}

export const userEnter = (client: He4rtClient, member: GuildMember) => {
  client.logger.emit({
    type: 'event',
    color: 'success',
    message: `${getTargetMember(member)} entrou no servidor!.`,
    customChannelId: REPORT_CHANNEL.id,
  })

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
