import {
  SUGGESTION_CHANNEL,
  CHAT_CHANNEL,
  MEETING_CHANNEL,
  MEETING_DELAS_CHANNEL,
  LEARNING_DIARY_CHANNEL,
  ADVERTS_CHANNEL,
} from '@/defines/ids.json'
import { HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { isAdministrator, isImageHTTPUrl, isValidProxyContent, js } from '@/utils'
import { ChannelType, GuildMember, Message } from 'discord.js'
import { He4rtClient, MessagePOST } from '@/types'

export const MessageListener = (client: He4rtClient, message: Message) => {
  const member = message.member as GuildMember

  if (!member?.id) return

  if (message.channel.type === ChannelType.DM || client.user?.id === message.author.id || !message.channelId) return

  client.api.he4rt
    .messages()
    .discord.post<MessagePOST>({
      // provider_message_parent_id: message.parentId
      provider_id: member.id,
      provider_message_id: message.id,
      channel_id: message.channelId,
      content: message.content,
      sent_at: message.createdAt,
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
    const isChatChannel = message.channel.id === CHAT_CHANNEL.id
    const content = message.content.toLowerCase().trim()

    if (content.length > 50 && isChatChannel) return

    const date = js().getUTCDate()

    const currentHour = date.getHours()
    const currentPeriod = (hour: number) => ({
      dawn: hour < 5,
      morning: hour >= 5 && hour < 12,
      afternoon: hour >= 12 && hour < 18,
      night: hour >= 18,
    })

    if (content.match(/(bom dia)/gi) && currentPeriod(currentHour).morning) {
      message.reply({ content: `dia!` }).catch(() => {})
    } else if (content.match(/(boa tarde)/gi) && currentPeriod(currentHour).afternoon) {
      message.reply({ content: `tarde!` }).catch(() => {})
    } else if (content.match(/(boa noite)/gi) && currentPeriod(currentHour).night) {
      message.reply({ content: `noite!` }).catch(() => {})
    } else if (content.match(/(boa madrugada)/gi) && currentPeriod(currentHour).dawn) {
      message.reply({ content: `boa madrugada!` }).catch(() => {})
    }
  }
}

export const bussinOrCap = async (message: Message) => {
  const validChannels = [CHAT_CHANNEL, MEETING_CHANNEL, MEETING_DELAS_CHANNEL]

  if (validChannels.some((v) => v.id === message.channel.id)) {
    const content = message.content.toLowerCase().split(/\s+/)
    const randomness = Math.round((Math.random() % 100) * 100)

    const containsRust = content.includes('rust')
    const containsGo = content.includes('go')

    if (containsRust && containsGo && randomness === 69) {
      message.reply({ content: 'no cap' }).catch(() => {})
    } else if (containsRust && randomness === 69) {
      message.reply({ content: 'bussin' }).catch(() => {})
    } else if (containsGo && randomness === 69) {
      message.reply({ content: 'cap' }).catch(() => {})
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
    await message.react(HE4RT_EMOJI_ID).catch(() => {})
  }
}

export const reactAnnouncesInAdvertsChannel = async (message: Message) => {
  if (ADVERTS_CHANNEL.id === message.channel.id) {
    await message.react('🔥').catch(() => {})
    await message.react(HE4RT_EMOJI_ID).catch(() => {})
  }
}
