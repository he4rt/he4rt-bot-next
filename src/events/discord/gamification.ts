import { ChannelType, GuildMember, Message } from 'discord.js'
import { He4rtClient, MessagePOST } from '@/types'

export const XPListener = (client: He4rtClient, message: Message) => {
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
