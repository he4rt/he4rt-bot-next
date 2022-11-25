import { ApoiaseGET, He4rtClient, UserGET, UserPUT } from '@/types'
import { getCustomColorRole, getGuild, isApoiaseMember, isNitroBoosterMember, isPrivilegedMember } from '@/utils'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE } from '@/defines/ids.json'
import { GuildMember } from 'discord.js'
import { CronJob } from 'cron'

export const verifyApoiaseMembers = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('00 00 12 10 * *', async () => {
    guild.members
      .fetch()
      .then((members) => {
        const normalize = members.filter((t) => isApoiaseMember(t))

        normalize.forEach((member) => {
          if (!isNitroBoosterMember(member)) {
            client.api.he4rt
              .users(member.id)
              .get<UserGET>()
              .then(({ email }) => {
                client.api.apoiase.backers
                  .charges(email)
                  .get<ApoiaseGET>()
                  .then(async ({ isBacker, isPaidThisMonth, thisMonthPaidValue }) => {
                    if (
                      isBacker &&
                      isPaidThisMonth &&
                      thisMonthPaidValue &&
                      thisMonthPaidValue >= APOIASE_CUSTOM_COLOR_MINIMAL_VALUE
                    ) {
                      return
                    }

                    await client.api.he4rt
                      .users(member.id)
                      .put<UserPUT>({
                        is_donator: 0,
                      })
                      .catch(() => {})

                    await member.roles.remove(DONATOR_ROLE.id).catch(() => {})
                  })
                  .catch(async () => {
                    await client.api.he4rt
                      .users(member.id)
                      .put<UserPUT>({
                        is_donator: 0,
                      })
                      .catch(() => {})

                    await member.roles.remove(DONATOR_ROLE.id).catch(() => {})
                  })
              })
              .catch(() => {})
          }
        })
      })
      .catch(() => {})
  }).start()
}

export const removeCustomColorOfUnderprivilegedMembers = async (
  client: He4rtClient,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  const guild = getGuild(client)
  const role = getCustomColorRole(oldMember)

  const old = isPrivilegedMember(oldMember)
  const active = isPrivilegedMember(newMember)

  if (!role) return

  if (old && !active) {
    newMember.roles
      .remove(role)
      .then(() => {
        guild.roles
          .delete(role)
          .then(() => {
            client.api.he4rt
              .users(oldMember.id)
              .put<UserPUT>({
                is_donator: 0,
              })
              .catch(() => {})
          })
          .catch(() => {})
      })
      .catch(() => {})
  }
}
