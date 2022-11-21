import { ChannelType, GuildMember, Message } from 'discord.js'
import { embedTemplate, getChannel } from '@/utils'
import { He4rtClient, MessagePOST } from '@/types'
import {
  BEGINNER_ROLE,
  INTERMEDIATE_ROLE,
  ADVANCED_ROLE,
  SUPREME_ROLE,
  HE4RT_ROLE,
  LEVELUP_CHANNEL,
  PRESENTATIONS_CHANNEL,
  COMMANDS_CHANNEL,
  MEETING_DELAS_CHANNEL,
  MEETING_CHANNEL,
} from '@/defines/ids.json'

export const XPCounterAndPossibleLevelUp = (client: He4rtClient, message: Message) => {
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

  client.api
    .users(member.id)
    .message.post<MessagePOST>({
      message: message.content,
    })
    .then(async (data) => {
      if (!data.is_levelup) return

      const lvl = parseInt(data.level, 10)

      const validLevelRole = {
        10: () => {
          member.roles.add(BEGINNER_ROLE.id)
        },
        20: () => {
          member.roles.add(INTERMEDIATE_ROLE.id)
        },
        30: () => {
          member.roles.add(ADVANCED_ROLE.id)
        },
        40: () => {
          member.roles.add(SUPREME_ROLE.id)
        },
        50: () => {
          member.roles.add(HE4RT_ROLE.id)
        },
      }[lvl]
      validLevelRole && validLevelRole()

      const embed = embedTemplate({
        title: `🆙 **${member.user.username}** subiu para o nível ${data.level}!`,
        target: {
          user: message.author,
          icon: true,
        },
      })

      const channel = getChannel({ id: LEVELUP_CHANNEL.id, client })

      await channel?.send({ content: `<@${message.author.id}>`, embeds: [embed] })
    })
    .catch(() => {})
}

export const gamificationListener = (client: He4rtClient, message: Message) => {
  XPCounterAndPossibleLevelUp(client, message)
}
