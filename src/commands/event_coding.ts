import { CommandInteraction, DMChannel, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { EVENT_CODING } from '@/defines/ids.json'
import INTRODUCTION from '-/commands/introduction.json'
import CODING from '-/commands/event_coding.json'
import { START_CODE_CHALLENGE } from '@/defines/commands.json'
import { TIMEOUT_ANSWER, TIMEOUT_COMMAND_STRING } from '@/defines/values.json'
import { getChannel, isValidId, reply, sendInDM } from '@/utils'
import { embedTemplate } from '@/utils'
import axios from 'axios'
import https from 'https'

const nextTextMessage = async (dm: DMChannel, interaction: CommandInteraction): Promise<string> => {
  try {
    const result = await dm.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      time: TIMEOUT_ANSWER,
      max: 1,
    })

    return result.first()!.content
  } catch (e) {
    return TIMEOUT_COMMAND_STRING
  }
}

interface Reward {
  he4rtCoin: number
  he4rtXp: number
  earned: boolean
  badge: string
  participantReward: boolean
  id: number
}

interface Event {
  dateStart: Date
  description: string
  fkReward: number
  isActive: boolean
  id: number
}

interface ApiResult<T> {
  type: string
  message: string
  dataResult: T
}

const nextMultipleRoleSelection = async (
  roles: any[],
  text: string,
  dm: DMChannel,
  member: GuildMember,
  interaction: CommandInteraction
) => {
  await dm.send(text)
  await dm.send(
    roles.reduce((acc, val, index) => (acc += `**${index + 1}**` + ` -   ${val.emoji} ${val.name}` + '\n'), '\n')
  )
  const myEmbed = embedTemplate({
    title: 'Evento de código',
    description: CODING.CONTINUE,
  })

  await dm.send({ embeds: [myEmbed] })

  const value = Number(await nextTextMessage(dm, interaction))

  if (isValidId(value, roles)) {
    member.roles.add(roles[value - 1].id)

    await nextMultipleRoleSelection(roles, text, dm, member, interaction)

    return
  }

  if (value === 0) return

  await dm.send(INTRODUCTION.INVALID_NUMBER)
  await nextMultipleRoleSelection(roles, text, dm, member, interaction)
}

interface Quiz {
  tip: string
  question: string
  answer: string
  hasNextQuestion: boolean
  id: number
  fkEvent: number
  title: string
}

const nextStringsData = async (dm: DMChannel, interaction: CommandInteraction): Promise<void> => {
  const instace = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })

  const { data } = await instace.get<ApiResult<Quiz[]>>(
    'http://localhost:5028/api/Quiz/get-all-by-event-id?eventId=1&api-version=1'
  )

  const embedQuestions = data.dataResult.map((question) => {
    return {
      title: question.title,
      hint: question.tip,
      description: question.question,
      answer: question.answer,
      nextQuestion: question.hasNextQuestion,
    }
  })

  for (const embedQuestion of embedQuestions) {
    await dm.send({ embeds: [embedQuestion] })

    async function retry() {
      const userAnswer = await nextTextMessage(dm, interaction)
      if (userAnswer === '/dica') {
        dm.send(`**${embedQuestion.hint}**`)
        await retry()
      } else if (userAnswer !== embedQuestion.answer) {
        dm.send('resposta errada')
        await retry()
      } else if (!embedQuestion.nextQuestion) {
        dm.send('parabainsss 🎉🎉🎉🎉🎉🎉')
      } else {
        dm.send('próxima pergunta')
      }
    }

    await retry()
  }
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction): Promise<boolean> => {
  const myEmbed = embedTemplate({
    title: 'Evento de código',
    description: CODING.CONTINUE,
  })
  await sendInDM(dm, interaction, '', myEmbed)

  if (!sendInDM) return false

  await reply(interaction).successInAccessDM()

  return true
}

const getReward = async () => {
  const instace = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
  const { data } = await instace.get<ApiResult<Reward>>('https://localhost:7168/api/Reward/get-reward?api-version=1')
  return data.dataResult
}

export const useQuizEvent = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(START_CODE_CHALLENGE.TITLE)
    .setDescription(START_CODE_CHALLENGE.DESCRIPTION)
    .setDMPermission(true)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user
      const member = interaction.member as GuildMember
      const instace = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      const { data } = await instace.get<ApiResult<null>>(
        'https://localhost:7168/api/EventUser/check-user?userId=228956489690251264&api-version=1'
      )
      if (data.type.toUpperCase() === 'WARNING') {
        await reply(interaction).errorParticipantFail()
        return
      }

      const evt = await instace.get<ApiResult<Event>>('https://localhost:7168/api/Event/active-event?api-version=1')

      if (evt.data.type.toUpperCase() === 'NONE') {
        await reply(interaction).errorEventNotFound()
        return
      }
      client.users
        .createDM(author)
        .then(async (dm) => {
          const valid = await validateAccess(dm, interaction)

          if (!valid) return

          await nextStringsData(dm, interaction)

          const channel = getChannel({ id: EVENT_CODING.id, client })
          await instace.post('https://localhost:7168/api/EventUser?api-version=1', {
            fkEvent: 1,
            fkUser: interaction.user.id,
          })

          const reward = await getReward()

          await member.roles.add(reward.badge)

          let winnerMessage = CODING.REWARD_ANNOUNCE
          winnerMessage = winnerMessage.replace('{user}', `<@${interaction.user.id}>`)
          winnerMessage = winnerMessage.replace('{coins}', `${reward.he4rtCoin}`)
          winnerMessage = winnerMessage.replace('{exp}', `${reward.he4rtXp} XP`)

          reward.earned = true
          if (!reward.participantReward) await instace.put('https://localhost:7168/api/Reward/?api-version=1', reward)
          await channel?.send({
            content: `👋 ${winnerMessage}`,
          })
        })
        .catch(() => {})
        .finally(async () => {})
    },
  ]
}
