import { He4rtClient, UserPUT } from '@/types'
import { CHAT_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { SUCCESS_NITRO_MESSAGE } from '-/events/nitro_boost.json'
import { getChannel, getCustomColorRole, getGuild, getTargetMember, isPrivilegedMember } from '@/utils'
import { GuildMember, Role } from 'discord.js'

export const setMemberIsADonatorOrNot = async (
  client: He4rtClient,
  oldMember: GuildMember,
  currentMember: GuildMember
) => {
  const guild = getGuild(client)

  const old = isPrivilegedMember(oldMember)
  const active = isPrivilegedMember(currentMember)

  const deleteCustomTag = (role: Role) => {
    currentMember.roles
      .remove(role)
      .then(() => {
        guild.roles.delete(role).catch(() => {})
      })
      .catch(() => {})
  }

  if (old && !active) {
    client.api.he4rt.users
      .profile(oldMember.id)
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
    client.api.he4rt.users
      .profile(currentMember.id)
      .put<UserPUT>({
        is_donator: 1,
      })
      .then(() => {
        client.logger.emit({
          message: `${getTargetMember(currentMember)} ganhou privilégios!`,
          type: 'http',
          color: 'success',
        })
      })
      .catch(() => {})
  }
}

export const userBoostingServerMessage = async (
  client: He4rtClient,
  oldMember: GuildMember,
  currentMember: GuildMember
) => {
  if (!oldMember?.premiumSince && currentMember.premiumSince) {
    const channel = getChannel({ client, id: CHAT_CHANNEL.id })

    const message = await channel.send(`<@${currentMember.user.id}>${SUCCESS_NITRO_MESSAGE}`)

    await message.suppressEmbeds(true).catch(() => {})

    await message.react(HE4RT_EMOJI_ID).catch(() => {})
  }
}
