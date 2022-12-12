import { He4rtClient, TickerName, VoicePOST } from '@/types'
import { VOICE_COUNTER_XP_IN_MINUTES, TICKER_SETTER } from '@/defines/values.json'
import { AWAY_VOICE_CHANNEL } from '@/defines/ids.json'
import { getGuild } from '@/utils'

export const setVoiceXP = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const xpTimer = 60 * VOICE_COUNTER_XP_IN_MINUTES
  let xpCounterInSeconds = TICKER_SETTER

  client.ticker.add(TickerName.VoiceXP, () => {
    --xpCounterInSeconds

    if (xpCounterInSeconds <= 0) {
      xpCounterInSeconds = xpTimer

      const members = [...guild.members.cache]
      const targets = members.filter(([_, member]) => member?.voice?.channel)

      for (const [id, member] of targets) {
        const voiceChannel = member.voice.channel

        const isTalking = !member.voice.selfMute && !member.voice.serverMute
        const isListening = !member.voice.selfDeaf && !member.voice.serverDeaf

        if (AWAY_VOICE_CHANNEL.id === voiceChannel.id) return

        if (isTalking && isListening) {
          client.api.he4rt
            .users(id)
            .voice.post<VoicePOST>()
            .catch(() => {})
        }
      }
    }
  })
}
