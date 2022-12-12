import { He4rtClient, TickerName } from '@/types'
import { ActivityType } from 'discord.js'
import { DISCORD_PRESENCE_IN_MINUTES, TICKER_SETTER } from '@/defines/values.json'

export const setPresence = (client: He4rtClient) => {
  const type = ActivityType.Watching as Exclude<ActivityType, ActivityType.Custom>

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
  const randomTimer = 60 * DISCORD_PRESENCE_IN_MINUTES
  let randomCounterInSeconds = TICKER_SETTER

  client.ticker.add(TickerName.DiscordPresence, () => {
    --randomCounterInSeconds

    if (randomCounterInSeconds <= 0) {
      randomCounterInSeconds = randomTimer

      client.user.setPresence({
        status: 'online',
        activities: [activities[Math.floor(Math.random() * activities.length)]],
      })
    }
  })
}
