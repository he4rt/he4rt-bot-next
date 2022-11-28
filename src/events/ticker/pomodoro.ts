import { He4rtClient, TickerName } from '@/types'
import { getGuild, getTaggedMembers, js } from '@/utils'
import { POMODORO_CHANNEL } from '@/defines/ids.json'
import { POMODORO_MUTATED_IN_MINUTES, POMODORO_TALKING_IN_MINUTES } from '@/defines/values.json'
import {
  TALKING_MUTATED_STARTED,
  TALKING_MUTATED_FORTY_MINUTES,
  TALKING_MUTATED_TWENTY_MINUTES,
  TALKING_MUTATED_TEN_MINUTES,
  TALKING_MUTATED_ONE_MINUTE,
  TALKING_TALKING_STARTED,
  TALKING_TALKING_FIVE_MINUTES,
  TALKING_TALKING_ONE_MINUTE,
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

  const sendMessage = async (str: string) => {
    const members = [...channel.members]

    if (members.length > 0) {
      const messages = (await channel.messages.fetch()).filter((m) => m.author.bot)

      for (const [_, message] of messages) {
        await message.delete().catch(() => {})
      }

      await channel.send(str).catch(() => {})
    }
  }

  client.ticker.add(TickerName.Pomodoro, () => {
    if (isMutated) mutated--
    if (isTalking) talking--

    if (mutated <= 0 && isMutated) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = false
      isTalking = true

      // TODO: overwrite EVERYONE permission, but actually discord rate limits not permitted this approach.
      channel.permissionOverwrites
        .edit(guild.id, { Speak: true })
        .then(async () => {
          await channel.setName(`🟢 Coworking | ${js().getTime()}`).catch(() => {})

          for (const [_, member] of channel.members) {
            await member.voice.setMute(false).catch(() => {})
          }

          await sendMessage(`${getTaggedMembers(channel.members.map((m) => m.id))} ${TALKING_TALKING_STARTED}`)
        })
        .catch(() => {})
    }

    if (talking <= 0 && isTalking) {
      mutated = mutatedTimer
      talking = talkingTimer

      isMutated = true
      isTalking = false

      channel.permissionOverwrites
        .edit(guild.id, { Speak: false })
        .then(async () => {
          await channel.setName(`🔴 Coworking | ${js().getTime()}`).catch(() => {})

          for (const [_, member] of channel.members) {
            await member.voice.setMute(true).catch(() => {})
          }

          await sendMessage(`${getTaggedMembers(channel.members.map((m) => m.id))} ${TALKING_MUTATED_STARTED}`)
        })
        .catch(() => {})
    }

    ;((
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
    )())
    ;((
      {
        300: () => {
          sendMessage(TALKING_TALKING_FIVE_MINUTES)
        },
        60: () => {
          sendMessage(TALKING_TALKING_ONE_MINUTE)
        },
      }[talking] || (() => {})
    )())
  })
}
