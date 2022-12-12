import { Message } from 'discord.js'
import {
  SUGGESTION_CHANNEL,
  CHAT_CHANNEL,
  MEETING_CHANNEL,
  MEETING_DELAS_CHANNEL,
  LEARNING_DIARY_CHANNEL,
  ADVERTS_CHANNEL,
  PRESENTATIONS_CHANNEL,
  HE4RT_EMOJI_ID,
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

    await js().sleep(1000)

    await message.suppressEmbeds(true).catch(() => {})
  }
}

export const sendGoodMessagesInBusyChannels = (message: Message) => {
  const validChannels = [CHAT_CHANNEL, MEETING_CHANNEL, MEETING_DELAS_CHANNEL]

  if (validChannels.some((v) => v.id === message.channel.id)) {
    const content = message.content.toLowerCase().trim()

    if (content.length > 50 && message.channel.id === CHAT_CHANNEL.id) return

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

export const reactEmbedsInPresentationsChannel = async (message: Message) => {
  if (PRESENTATIONS_CHANNEL.id === message.channel.id) {
    await message.react(HE4RT_EMOJI_ID).catch(async () => {
      await message.react('💜').catch(() => {})
    })
  }
}
