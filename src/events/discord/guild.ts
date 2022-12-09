import { He4rtClient, IntroducePOST } from '@/types'
import { getTargetMember } from '@/utils'
import { GuildMember, PartialGuildMember } from 'discord.js'

export const deletePossibleUserInServerLeave = (client: He4rtClient, member: GuildMember | PartialGuildMember) => {
  client.api.he4rt
    .users(member.id)
    .delete()
    .then(() => {
      client.logger.emit({
        type: 'http',
        color: 'info',
        message: `${getTargetMember(member as GuildMember)} **saiu do servidor e teve a sua conta deletada!**`,
      })
    })
    .catch(() => {})
}

export const createUserInServerEnter = (client: He4rtClient, member: GuildMember) => {
  client.api.he4rt
    .users()
    .post<IntroducePOST>({
      discord_id: member.id,
    })
    .then(() => {
      client.logger.emit({
        type: 'http',
        color: 'info',
        message: `${getTargetMember(member)} **entrou no servidor e teve a sua conta criada!**`,
      })
    })
    .catch(() => {})
}
