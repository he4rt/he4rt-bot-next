import { ActivityType } from 'discord.js'
import { He4rtClient } from '../types'

export const setPresence = (client: He4rtClient) => {
  client?.user?.setPresence({
    status: 'online',
    activities: [
      {
        name: 'heartdevs.com',
        type: ActivityType.Watching,
        url: 'https://heartdevs.com/',
      },
    ],
  })
}

export const afterListeners = async (client: He4rtClient) => {
  setPresence(client)
}
