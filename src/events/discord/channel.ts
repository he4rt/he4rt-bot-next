import { Message } from 'discord.js'
import {
  SUGGESTION_CHANNEL,
  CHAT_CHANNEL,
  MEETING_CHANNEL,
  MEETING_DELAS_CHANNEL,
  LEARNING_DIARY_CHANNEL,
  ADVERTS_CHANNEL,
} from '@/defines/ids.json'
import { isAdministrator, isImageHTTPUrl, isValidProxyContent, js } from '@/utils'

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
