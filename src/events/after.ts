import { ActivityType } from 'discord.js'
import { He4rtClient } from '@/types'
import { setPomodoroListener } from './pomodoro'

export const setPresence = (client: He4rtClient) => {
  const type = ActivityType.Watching as Exclude<ActivityType, ActivityType.Custom>

  client?.user?.setPresence({
    status: 'online',
    activities: [
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
    ],
  })
}

export const afterEvents = async (client: He4rtClient) => {
  await setPresence(client)
  await setPomodoroListener(client)
}
