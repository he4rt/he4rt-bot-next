import { He4rtClient, UserPUT } from '@/types'
import { getCustomColorRole, getGuild, getTargetMember, isPrivilegedMember } from '@/utils'
import { GuildMember } from 'discord.js'

export const removeCustomColorOfUnderprivilegedMembers = async (
  client: He4rtClient,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  const guild = getGuild(client)
  const role = getCustomColorRole(oldMember)

  const old = isPrivilegedMember(oldMember)
  const active = isPrivilegedMember(newMember)

  if (!role) return

  if (old && !active) {
    newMember.roles
      .remove(role)
      .then(() => {
        guild.roles
          .delete(role)
          .then(() => {
            client.api.he4rt
              .users(oldMember.id)
              .put<UserPUT>({
                is_donator: 0,
              })
              .then(() => {
                client.logger.emit({
                  message: `${getTargetMember(
                    oldMember
                  )} teve o seu **cargo customizado removido** por ter perdido o privilégio!`,
                  type: 'role',
                  color: 'info',
                })
              })
              .catch(() => {})
          })
          .catch(() => {})
      })
      .catch(() => {})
  }
}
