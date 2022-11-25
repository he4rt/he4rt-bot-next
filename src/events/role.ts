import { He4rtClient, ProfilePUT } from '@/types'
import { getCustomColorRole, getGuild, isPrivileged } from '@/utils'
import { GuildMember } from 'discord.js'

export const removeCustomColorOfUnderprivilegedMembers = async (
  client: He4rtClient,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  const guild = getGuild(client)
  const role = getCustomColorRole(oldMember)

  const old = isPrivileged(oldMember)
  const active = isPrivileged(newMember)

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
              .put<ProfilePUT>({
                is_donator: 0,
              })
              .catch(() => {})
          })
          .catch(() => {})
      })
      .catch(() => {})
  }
}
