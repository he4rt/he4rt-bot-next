import { He4rtClient } from '@/types'
import { ActivityType } from 'discord.js'
import { DISCORD_PRESENCE_IN_MINUTES } from '@/defines/values.json'

export const setPresence = (client: He4rtClient) => {
  const type = ActivityType.Watching as Exclude<ActivityType, ActivityType.Custom>

  const randomTimer = 60 * DISCORD_PRESENCE_IN_MINUTES

  let random = randomTimer

  client.ticker.add(() => {
    --random

    if (random <= 0) {
      random = randomTimer

      const activities = [
        {
          type,
          url: 'https://heartdevs.com',
          name: 'da comunidade para a comunidade.',
        },
        {
          type,
          url: 'https://beacons.ai/heartdevs',
          name: 'beacons.ai/heartdevs',
        },
        {
          type,
          url: 'https://heartdevs.com',
          name: 'heartdevs.com',
        },
        {
          type,
          url: 'https://github.com/he4rt',
          name: 'github.com/he4rt',
        },
        {
          type,
          url: 'https://heartdevs.com',
          name: '/apresentar',
        },
      ]

      client.user.setPresence({
        status: 'online',
        activities: [activities[Math.floor(Math.random() * activities.length)]],
      })
    }
  })
}
