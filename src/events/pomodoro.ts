import { He4rtClient } from '@/types'
import { getGuild } from '@/utils'
import { POMODORO_CHANNEL } from '@/defines/ids.json'
import { POMODORO_MUTATED_IN_MINUTES, POMODORO_TALKING_IN_MINUTES } from '@/defines/values.json'
import { TALKING_LESS_THAN_ONE_MINUTE } from '-/events/pomodoro.json'
import { VoiceChannel } from 'discord.js'

export const setPomodoroListener = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const channel = (await guild.channels.fetch(POMODORO_CHANNEL.id)) as VoiceChannel

  const mutatedTimer = 60 * POMODORO_MUTATED_IN_MINUTES
  const talkingTimer = 60 * POMODORO_TALKING_IN_MINUTES

  let mutated = mutatedTimer
  let talking = talkingTimer

  let isMutated = false
  let isTalking = true

  client.ticker.add(() => {
    if (isMutated) mutated--
    if (isTalking) talking--

    if (mutated <= 0 && isMutated) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = false
      isTalking = true

      // TODO: overwrite PRESENTED_ROLE permission, but actually discord rate limits not permitted this approach.
      channel.permissionOverwrites
        .edit(guild.id, { MuteMembers: false })
        .then(() => {
          channel.setName('🟢 Coworking')
        })
        .catch(() => {})
    }

    if (talking <= 0 && isTalking) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = true
      isTalking = false

      channel.permissionOverwrites
        .edit(guild.id, { MuteMembers: true })
        .then(() => {
          channel.setName('🔴 Coworking')
        })
        .catch(() => {})
    }

    if (talkingTimer === 60) {
      if ([...channel.members].length > 0) channel.send(TALKING_LESS_THAN_ONE_MINUTE)
    }
  })
}
