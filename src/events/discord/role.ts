import { He4rtClient } from '@/types'
import { CHAT_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { SUCCESS_NITRO_MESSAGE } from '-/events/nitro_boost.json'
import {
  getChannel,
  getCustomColorRole,
  getGuild,
  getTargetMember,
  isNitroBoosterMember,
  isPrivilegedMember,
  sendMessageToChannel,
} from '@/utils'
import { GuildMember, Role } from 'discord.js'
import { upsertUser } from '@/http/firebase'

export const setMemberIsAPrivilegedOrNot = async (
  client: He4rtClient,
  oldMember: GuildMember,
  currentMember: GuildMember,
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
    const role = getCustomColorRole(oldMember)

    if (role) deleteCustomTag(role)
  }
}

export const userBoostingServerMessage = async (
  client: He4rtClient,
  oldMember: GuildMember,
  currentMember: GuildMember,
) => {
  if (!oldMember?.premiumSince && currentMember.premiumSince) {
    const channel = getChannel({ client, id: CHAT_CHANNEL.id })
    const message = await sendMessageToChannel(channel, `<@${currentMember.user.id}>${SUCCESS_NITRO_MESSAGE}`)

    await message.suppressEmbeds(true).catch(() => {})

    await message.react(HE4RT_EMOJI_ID).catch(() => {})
  }
}

export const setMemberIsANitroOrNot = async (
  client: He4rtClient,
  oldMember: GuildMember,
  currentMember: GuildMember,
) => {
  const old = isNitroBoosterMember(oldMember)
  const active = isNitroBoosterMember(currentMember)

  if (old && !active) {
    upsertUser(client, { id: currentMember.id, nitro: false })
      .then(() => {
        client.logger.emit({
          message: `${getTargetMember(oldMember)} perdeu seu nitro!`,
          type: 'http',
          color: 'warning',
        })
      })
      .catch(() => {})
  }

  if (!old && active) {
    upsertUser(client, { id: currentMember.id, nitro: true })
      .then(() => {
        client.logger.emit({
          message: `${getTargetMember(currentMember)} gastou nitro no servidor!`,
          type: 'http',
          color: 'success',
        })
      })
      .catch(() => {})
  }
}
