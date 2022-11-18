import { CommandInteraction, Routes } from 'discord.js'
import { Command, Context, He4rtClient } from '@/types'
import { useAnnounce } from './announce'
import { useBan } from './ban'
import { useColor } from './color'
import { useDaily } from './daily'
import { useIntroduction } from './introduction'
import { useProfile } from './profile'
import { useRanking } from './ranking'

const registerHooks = (client: He4rtClient, commands: Command[]) => {
  commands.forEach(([data, cb]) => {
    client.commands.set(data, cb)
  })
}

export const registerCommands = async ({ client, rest }: Context) => {
  registerHooks(client, [
    useIntroduction(),
    useAnnounce(),
    useColor(),
    useBan(),
    useRanking(),
    useDaily(),
    useProfile(),
  ])

  await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {
    body: [...client.commands.keys()],
  })
}

export const commandsListener = async (client: He4rtClient, interaction: CommandInteraction) => {
  for (const [key, cb] of client.commands) {
    if (key.name === interaction.commandName) cb && (await cb(interaction, client))
  }
}
