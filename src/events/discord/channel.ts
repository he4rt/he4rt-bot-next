import {
  SUGGESTION_CHANNEL,
  CHAT_CHANNEL,
  MEETING_CHANNEL,
  MEETING_DELAS_CHANNEL,
  LEARNING_DIARY_CHANNEL,
  ADVERTS_CHANNEL,
} from '@/defines/ids.json'
import { isAdministrator, isImageHTTPUrl, isValidProxyContent, js } from '@/utils'

import { ChannelType, GuildMember, Message } from 'discord.js'
import { He4rtClient, MessagePOST } from '@/types'

export const MessageListener = (client: He4rtClient, message: Message) => {
  const member = message.member as GuildMember

  if (!member?.id) return

  if (message.channel.type === ChannelType.DM || client.user?.id === message.author.id || !message.channelId) return

  client.api.he4rt
    .users(member.id)
    .message.post<MessagePOST>({
      channel_id: message.channelId,
      message_content: message.content,
      message_id: message.id,
      message_at: message.createdTimestamp,
    })
    .catch(() => {})
}

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

export const sendGoodMessagesInBusyChannels = (message: Message) => {
  const validChannels = [CHAT_CHANNEL, MEETING_CHANNEL, MEETING_DELAS_CHANNEL]

  if (validChannels.some((v) => v.id === message.channel.id)) {
    const content = message.content.toLowerCase().trim()

    if (content.length > 50 && message.channel.id === CHAT_CHANNEL.id) return

    const date = js().getUTCDate()

    const currentHour = date.getHours()
    const currentPeriod = (hour) => ({
      dawn: hour < 5,
      morning: hour >= 5 && hour < 12,
      afternoon: hour >= 12 && hour < 18,
      night: hour >= 18,
    })

    if (content.startsWith('bom dia') && currentPeriod(currentHour).morning) {
      message.reply({ content: `dia!` }).catch(() => {})
    } else if (content.startsWith('boa tarde') && currentPeriod(currentHour).afternoon) {
      message.reply({ content: `tarde!` }).catch(() => {})
    } else if (content.startsWith('boa noite') && currentPeriod(currentHour).night) {
      message.reply({ content: `noite!` }).catch(() => {})
    } else if (content.startsWith('boa madrugada') && currentPeriod(currentHour).dawn) {
      message.reply({ content: `boa madrugada!` }).catch(() => {})
    }
  }
}

export const reactMessagesInSuggestionChannel = async (message: Message) => {
  if (SUGGESTION_CHANNEL.id === message.channel.id) {
    await message.react('✅').catch(() => {})
    await message.react('❌').catch(() => {})
  }
}

export const reactMessagesInLearningDiaryChannel = async (message: Message) => {
  if (LEARNING_DIARY_CHANNEL.id === message.channel.id) {
    await message.react('💜').catch(() => {})
  }
}

export const reactAnnouncesInAdvertsChannel = async (message: Message) => {
  if (ADVERTS_CHANNEL.id === message.channel.id) {
    await message.react('🔥').catch(() => {})
    await message.react('💜').catch(() => {})
  }
}
