import { ButtonInteraction, CommandInteraction, GuildMember, Routes } from 'discord.js'
import { Command, Context, He4rtClient } from '@/types'
import { useAnnounce } from './announce'
import { useBan } from './ban'
import { useColor } from './color'
import { useDaily } from './daily'
import { useIntroduction } from './introduction'
import { useProfileGet } from './profile_get'
import { useRanking } from './ranking'
import { useUnban } from './unban'
import { useChat } from './chat'
import { useTimeout } from './timeout'
import { useSay } from './say'
import { useCode } from './code'
import { useClear } from './clear'
import { useApoiase } from './apoiase'
import { useVersion } from './version'
import { useAsk } from './ask'
import { getTargetMember } from '@/utils'
import { useBadgePost } from './badge_post'
import { useProfilePut } from './profile_put'
import { useLogikoz } from './special/logikoz'
import { useBadgeRedeem } from './badge_redeem'
import { useRolePost } from './role_post'
import { useRoleDelete } from './role_delete'
import { useForumClose } from './forum_close'
import { resolveJudgeCommandButtonEvents, useJudge } from './judge'
import { JUDGE } from '@/defines/commands.json'

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
    useUnban(),
    useRanking(),
    useDaily(),
    useProfileGet(),
    useProfilePut(),
    useChat(),
    useTimeout(),
    useSay(),
    useCode(),
    useClear(),
    useApoiase(),
    useVersion(),
    useAsk(),
    useBadgePost(),
    useBadgeRedeem(),
    useLogikoz(),
    useRolePost(),
    useRoleDelete(),
    useJudge(),
    useForumClose(),
    // useReputation()
  ])

  await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {
    body: [...client.commands.keys()],
  })
}

export const commandsListener = (client: He4rtClient, interaction: CommandInteraction) => {
  for (const [key, cb] of client.commands) {
    if (key.name === interaction.commandName) {
      cb && cb(interaction, client)

      if (key.name === JUDGE.TITLE) return

      client.logger.emit({
        message: `${getTargetMember(interaction.member as GuildMember)} acionou **/${key.name}** no canal **${
          interaction.channel.name
        }**`,
        type: 'command',
        color: 'info',
      })
    }
  }
}

export const buttonListener = async (client: He4rtClient, interaction: ButtonInteraction) => {
  await resolveJudgeCommandButtonEvents(client, interaction)
}
