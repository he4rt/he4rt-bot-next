import { He4rtClient, UserPUT } from '@/types'
import { getCustomColorRole, getGuild, getTargetMember, isPrivilegedMember } from '@/utils'
import { GuildMember, Role } from 'discord.js'

export const setMemberIsADonatorOrNot = async (client: He4rtClient, oldMember: GuildMember, newMember: GuildMember) => {
  const guild = getGuild(client)

  const old = isPrivilegedMember(oldMember)
  const active = isPrivilegedMember(newMember)

  const deleteCustomTag = (role: Role) => {
    newMember.roles
      .remove(role)
      .then(() => {
        guild.roles.delete(role).catch(() => {})
      })
      .catch(() => {})
  }

  if (old && !active) {
    client.api.he4rt
      .users(oldMember.id)
      .put<UserPUT>({
        is_donator: 0,
      })
      .then(() => {
        client.logger.emit({
          message: `${getTargetMember(oldMember)} perdeu seus privilégios!`,
          type: 'http',
          color: 'warning',
        })

        const role = getCustomColorRole(oldMember)

        if (role) deleteCustomTag(role)
      })
      .catch(() => {})
  }

  if (!old && active) {
    client.api.he4rt
      .users(newMember.id)
      .put<UserPUT>({
        is_donator: 1,
      })
      .then(() => {
        client.logger.emit({
          message: `${getTargetMember(newMember)} ganhou privilégios!`,
          type: 'http',
          color: 'success',
        })
      })
      .catch(() => {})
  }
}
