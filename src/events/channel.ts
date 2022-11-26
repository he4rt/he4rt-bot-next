import { Message } from 'discord.js'
import { CHAT_CHANNEL, MEETING_CHANNEL, MEETING_DELAS_CHANNEL } from '@/defines/ids.json'
import { isAdministrator, isImageHTTPUrl, isValidProxyContent } from '@/utils'

export const suppressEmbedMessagesInBusyChannels = async (message: Message) => {
  const validChannels = [CHAT_CHANNEL, MEETING_CHANNEL, MEETING_DELAS_CHANNEL]

  if (validChannels.some((v) => v.id === message.channel.id)) {
    if (
      message.embeds.length === 0 ||
      isAdministrator(message.member) ||
      isValidProxyContent(message.content) ||
      isImageHTTPUrl(message.content)
    )
      return

    await message.suppressEmbeds(true).catch(() => {})
  }
}

export const sendGoodMessagesInChatChannel = (message: Message) => {
  if (CHAT_CHANNEL.id === message.channel.id) {
    const content = message.content.toLowerCase().trim()

    if (content.startsWith('bom dia')) {
      message.reply({ content: `dia!` }).catch(() => {})
    }
    if (content.startsWith('boa tarde')) {
      message.reply({ content: `tarde!` }).catch(() => {})
    }
    if (content.startsWith('boa noite')) {
      message.reply({ content: `noite!` }).catch(() => {})
    }
  }
}
