import { He4rtClient } from '@/types'
import { getGuild, js } from '@/utils'
import { POMODORO_CHANNEL, PRESENTED_ROLE } from '@/defines/ids.json'
import { POMODORO_MUTATED_IN_MINUTES, POMODORO_TALKING_IN_MINUTES } from '@/defines/values.json'
import {
  TALKING_MUTATED_STARTED,
  TALKING_MUTATED_FORTY_MINUTES,
  TALKING_MUTATED_TWENTY_MINUTES,
  TALKING_MUTATED_TEN_MINUTES,
  TALKING_MUTATED_ONE_MINUTE,
  TALKING_SPEAKING_STARTED,
  TALKING_SPEAKING_FIVE_MINUTE,
  TALKING_SPEAKING_ONE_MINUTE,
} from '-/events/pomodoro.json'
import { VoiceChannel } from 'discord.js'

export const setPomodoroListener = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const channel = (await guild.channels.fetch(POMODORO_CHANNEL.id)) as VoiceChannel

  const mutatedTimer = 60 * POMODORO_MUTATED_IN_MINUTES
  const talkingTimer = 60 * POMODORO_TALKING_IN_MINUTES

  let mutated = 10
  let talking = 10

  let isMutated = false
  let isTalking = true

  const sendMessage = (str: string) => {
    const members = [...channel.members]

    if (members.length > 0) channel.send(str).catch(() => {})
  }

  client.ticker.add(() => {
    if (isMutated) mutated--
    if (isTalking) talking--

    if (mutated <= 0 && isMutated) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = false
      isTalking = true

      // TODO: overwrite EVERYONE permission, but actually discord rate limits not permitted this approach.
      channel.permissionOverwrites
        .edit(PRESENTED_ROLE.id, { Speak: true })
        .then(async () => {
          await channel.setName(`🟢 Coworking | ${js().getTime()}`).catch(() => {})

          sendMessage(TALKING_SPEAKING_STARTED)
        })
        .catch(() => {})
    }

    if (talking <= 0 && isTalking) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = true
      isTalking = false

      channel.permissionOverwrites
        .edit(PRESENTED_ROLE.id, { Speak: false })
        .then(async () => {
          await channel.setName(`🔴 Coworking | ${js().getTime()}`).catch(() => {})

          sendMessage(TALKING_MUTATED_STARTED)
        })
        .catch(() => {})
    }

    const _MUTATED = (
      {
        2400: () => {
          sendMessage(TALKING_MUTATED_FORTY_MINUTES)
        },
        1200: () => {
          sendMessage(TALKING_MUTATED_TWENTY_MINUTES)
        },
        600: () => {
          sendMessage(TALKING_MUTATED_TEN_MINUTES)
        },
        60: () => {
          sendMessage(TALKING_MUTATED_ONE_MINUTE)
        },
      }[mutated] || (() => {})
    )()

    const _TALKING = (
      {
        300: () => {
          sendMessage(TALKING_SPEAKING_FIVE_MINUTE)
        },
        60: () => {
          sendMessage(TALKING_SPEAKING_ONE_MINUTE)
        },
      }[talking] || (() => {})
    )()
  })
}
