import { getCustomColorRole, isPrivileged } from '@/utils'
import { GuildMember } from 'discord.js'

export const removeCustomColorOfUnderprivilegedMembers = (oldMember: GuildMember, newMember: GuildMember) => {
  const custom = getCustomColorRole(oldMember)

  const old = isPrivileged(oldMember)
  const active = isPrivileged(newMember)

  if (!custom) return

  if (old && !active) {
    // TODO: users PUT to set donator case

    newMember.roles.remove(custom)
  }
}
