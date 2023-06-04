import { CommandInteraction, DMChannel, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, He4rtClient } from '@/types'
import { EVENT_CODING } from '@/defines/ids.json'
import CODING from '-/commands/event_coding.json'
import { START_CODE_CHALLENGE } from '@/defines/commands.json'
import { TIMEOUT_ANSWER, TIMEOUT_COMMAND_STRING } from '@/defines/values.json'
import { getChannel, isValidId, reply, sendInDM } from '@/utils'
import { embedTemplate } from '@/utils'
import { checkUserEventEntry, claimEventReward, getActiveEvent, getEventQuizzesById } from '@/http/firebase'
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
    title: '',
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

  await nextMultipleRoleSelection(roles, text, dm, member, interaction)
}



const nextStringsData = async (dm: DMChannel, interaction: CommandInteraction, client: He4rtClient, eventId: string): Promise<void> => {
  
  const quizzes = await getEventQuizzesById(client, eventId)

  for (const quiz of quizzes) {
    const embed = embedTemplate({ title: quiz.title, description: quiz.question })
    await dm.send({ embeds: [embed] })

    const embedWrongAnswer = embedTemplate({
      title: 'Excelente tentativa, mas a resposta não está correta.',
      description: 'Essa foi a resposta errada.',
      color: '#FF0000'
    })

    const embedRightAnswer = embedTemplate({
      title: 'Ótima resposta, aqui vai a próxima!',
      description: `Respostas: **${quiz.answer}**`,
      color: '#00FF00'
    })

    const embedTipQuestion = embedTemplate({
      title: quiz.tip,
      color: '#00FFFF'
    })

    const embedFinishedEvent = embedTemplate({
      title: 'Parabéns!! você conseguiu concluir o evento🎉🎉🎉',
    })

    async function retry() {
      const userInput = await nextTextMessage(dm, interaction)
      if (userInput === '!dica') {
        dm.send({embeds: [embedTipQuestion]})
        await retry()
      } else if (userInput !== quiz.answer) {
        dm.send('💥')
        dm.send({embeds: [embedWrongAnswer]})
        await retry()
      } else if (!quiz.has_next_question) {
        dm.send({ embeds: [embedFinishedEvent]})
      } else {
        dm.send({ embeds: [embedRightAnswer]})
      }
    }

    await retry()
  }
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction): Promise<boolean> => {
  const myEmbed = embedTemplate({
    title: 'Evento de programação',
    description: CODING.CONTINUE,
  })
  await sendInDM(dm, interaction, '', myEmbed)

  if (!sendInDM) return false

  await reply(interaction).successInAccessDM()

  return true
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

      const activeEventId = await getActiveEvent(client)
      if (!activeEventId) {
        await reply(interaction).errorEventNotFound()
        return
      }

      const isUserEligible = await checkUserEventEntry(client, { eventId: activeEventId, userId: interaction.user.id })

      if (!isUserEligible) {
        await reply(interaction).errorParticipantFail()
        return
      }

      const places = {
        first: 'primeiro',
        second: 'segundo',
        third: 'terceiro',
      }

      client.users
        .createDM(author)
        .then(async (dm) => {
          const valid = await validateAccess(dm, interaction)

          if (!valid) return

          await nextStringsData(dm, interaction, client, activeEventId)

          const channel = getChannel({ id: EVENT_CODING.id, client })

          const claimedReward = await claimEventReward(client, activeEventId, interaction.user.id)
          
          await member.roles.add(claimedReward.badge)

          let participantMessage = CODING.REWARD_PARTICIPANT
          participantMessage = participantMessage
            .replace('{user}', `${author.username}`)
            .replace('{exp}', `${claimedReward.he4rt_xp} XP`)

          const participantEmbed = embedTemplate({title: participantMessage})
          
          const winnerEmbed = embedTemplate({
            title: `${author.username} conseguiu responder todas as perguntas com sucesso!`,
            description: `Como recompensa do ${places[claimedReward.place]} lugar ganhou **${claimedReward.he4rt_xp}** de experiência!`
          })

          claimedReward.place === 'participant'
            ? await dm.send({ embeds: [(participantEmbed)]})
            : await channel?.send({ embeds: [winnerEmbed] })         
        })
        .catch(() => {})
        .finally(async () => {})
    },
  ]
}
