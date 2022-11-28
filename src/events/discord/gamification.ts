import { ChannelType, GuildMember, Message } from 'discord.js'
import { He4rtClient, MessagePOST } from '@/types'
import {
  LEVELUP_CHANNEL,
  PRESENTATIONS_CHANNEL,
  COMMANDS_CHANNEL,
  MEETING_DELAS_CHANNEL,
  MEETING_CHANNEL,
} from '@/defines/ids.json'

export const XPListener = (client: He4rtClient, message: Message) => {
  const member = message.member as GuildMember

  if (!member?.id) return

  const invalidChannels = [
    LEVELUP_CHANNEL,
    PRESENTATIONS_CHANNEL,
    COMMANDS_CHANNEL,
    MEETING_CHANNEL,
    MEETING_DELAS_CHANNEL,
  ]

  if (message.channel.type === ChannelType.DM || invalidChannels.some((v) => v.id === message.channel.id)) return

  if (client.user?.id === message.author.id) return

  client.api.he4rt
    .users(member.id)
    .message.post<MessagePOST>({
      message: message.content,
    })
    .catch(() => {})
}
