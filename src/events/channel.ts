import { Message } from 'discord.js'
import { CHAT_CHANNEL } from '@/defines/ids.json'
import { isAdministrator } from '@/utils'

export const suppressEmbedMessagesInBusyChannels = async (message: Message) => {
  const validChannels = [CHAT_CHANNEL]
  const member = message.member

  if (validChannels.some((v) => v.id !== message.channel.id)) return

  if (isAdministrator(member) || message.embeds.length > 0) return

  await message.suppressEmbeds(true).catch(() => {})
}
