import { He4rtClient, TickerName } from '@/types'
import { VOICE_COUNTER_XP_IN_MINUTES, TICKER_SETTER } from '@/defines/values.json'
import { getGuild } from '@/utils'

export const setVoiceXP = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const xpTimer = 60 * VOICE_COUNTER_XP_IN_MINUTES
  let xp = TICKER_SETTER

  const members = [...(await guild.members.fetch())]

  client.ticker.add(TickerName.VoiceXP, () => {
    --xp

    if (xp <= 0) {
      xp = xpTimer

      for (const [_, member] of members) {
        const inVoiceChannel = member.voice.channel

        if (inVoiceChannel) {
          const isTalking = !member.voice.selfMute && !member.voice.serverMute
          const isListening = !member.voice.selfDeaf && !member.voice.serverDeaf

          // TODO: api request to counter xp.
        }
      }
    }
  })
}
