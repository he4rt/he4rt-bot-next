import { ButtonInteraction, CommandInteraction, GuildMember, Routes } from 'discord.js'
import { Command, Context, He4rtClient } from '@/types'
import { useAnnounce } from './announce'
import { useBan } from './ban'
import { useColor } from './color'
import { useDaily } from './daily'
import { useIntroduction } from './introduction'
import { useProfileGet } from './profile/profile_get'
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
import { useProfilePut } from './profile/profile_put'
import { useBadgeRedeem } from './badge/badge_redeem'
import { useRolePost } from './role/role_post'
import { useRoleDelete } from './role/role_delete'
import { resolveJudgeCommandButtonEvents, useJudge } from './judge'
import { useForumClose } from './forum/forum_close'
import { useForumCreate } from './forum/forum_create'
import { useDynamicVoice } from './dynamic_voice/dynamic_voice_create'
import { useDynamicVoiceSize } from './dynamic_voice/dynamic_voice_size'
import { useDynamicVoiceOwner } from './dynamic_voice/dynamic_voice_owner'
import { useStageATA } from './stage/stage_ata'
import { useStageStart } from './stage/stage_start'
import { useStageFinish } from './stage/stage_finish'
import { useOnboardingVoluntary } from './onboarding/onboarding_voluntary'
import { useOnboardingRequire } from './onboarding/onboarding_require'
import { useOnboardingFinalize } from './onboarding/onboarding_finalize'
import { useOnboardingQuit } from './onboarding/onboarding_quit'
import { useOnboardingWhy } from './onboarding/onboarding_why'
import { useSpecial } from './special'
import { useDynamicVoiceTitle } from './dynamic_voice/dynamic_voice_title'
import { useMedal } from './medal'
import { useWatch } from './watch/watch_set'
import { useWatchList } from './watch/watch_get'
import { useWatchRemove } from './watch/watch_remove'

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
    useBadgeRedeem(),
    useRolePost(),
    useRoleDelete(),
    useJudge(),
    useForumClose(),
    useForumCreate(),
    useDynamicVoice(),
    useDynamicVoiceSize(),
    useDynamicVoiceOwner(),
    useDynamicVoiceTitle(),
    useStageATA(),
    useStageFinish(),
    useStageStart(),
    useOnboardingVoluntary(),
    useOnboardingRequire(),
    useOnboardingFinalize(),
    useOnboardingQuit(),
    useOnboardingWhy(),
    useSpecial(),
    useMedal(),
    useWatch(),
    useWatchList(),
    useWatchRemove(),
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
