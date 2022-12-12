import { He4rtClient, TickerName } from '@/types'
import {
  DYNAMIC_VOICE_DELETE_CHANNELS_IN_MINUTES,
  DYNAMIC_VOICE_INVITE_LIMIT_TIME,
  TICKER_SETTER,
} from '@/defines/values.json'
import { getDynamicVoiceCategory, getGuild } from '@/utils'
import { Collection, GuildMember } from 'discord.js'

export const setDynamicVoiceRemover = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const voiceTimer = 60 * DYNAMIC_VOICE_DELETE_CHANNELS_IN_MINUTES
  let voiceCounterInSeconds = TICKER_SETTER

  client.ticker.add(TickerName.DynamicVoice, () => {
    --voiceCounterInSeconds

    if (voiceCounterInSeconds <= 0) {
      voiceCounterInSeconds = voiceTimer

      const category = getDynamicVoiceCategory(client)
      const channels = [...guild.channels.cache]

      channels.forEach(async ([_, channel]) => {
        if (channel.parentId !== category.id) return

        const targets = [...(channel.members as Collection<string, GuildMember>)]

        const actuallyTime = new Date().valueOf()
        const expirationLimitTime = new Date(channel.createdAt).valueOf() + DYNAMIC_VOICE_INVITE_LIMIT_TIME

        if (targets.length === 0 && actuallyTime > expirationLimitTime) {
          channel
            .delete()
            .then(() => {
              client.logger.emit({
                message: `O canal de voz dinâmico **${channel.id}** foi deletado automaticamente com sucesso!`,
                type: 'command',
                color: 'success',
              })
            })
            .catch(() => {})
        }
      })
    }
  })
}
