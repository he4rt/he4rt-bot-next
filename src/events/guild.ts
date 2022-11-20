import { Message } from 'discord.js'
import { He4rtClient } from '@/types'
import { CHAT_CHANNEL } from '@/defines/ids.json'
import { isAdministrator } from '@/utils'

export const deletePossibleUserInServerLeave = (client: He4rtClient, id: string) => {
  client.api
    .users(id)
    .delete()
    .then(() => {})
    .catch(() => {})
}

export const suppressEmbedMessagesInBusyChannels = async (message: Message) => {
  const validChannels = [CHAT_CHANNEL]
  const member = message.member

  if (validChannels.some((v) => v.id !== message.channel.id)) return

  if (isAdministrator(member)) return

  try {
    if (message.embeds.length > 0) await message.suppressEmbeds(true)
  } catch (e) {}
}
