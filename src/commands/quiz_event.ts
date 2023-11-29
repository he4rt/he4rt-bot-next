import { CommandInteraction, DMChannel, GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command, He4rtClient } from '@/types'
import { QUIZ_EVENT } from '@/defines/ids.json'
import QUIZ from '-/commands/quiz_event.json'
import { START_CODE_CHALLENGE } from '@/defines/commands.json'
import { TIMEOUT_ANSWER, TIMEOUT_COMMAND_STRING, COLORS } from '@/defines/values.json'
import { getChannel, reply, sendInDM } from '@/utils'
import { embedTemplate } from '@/utils'
import { checkUserEventEntry, claimEventReward, getActiveEvent, getEventQuizzesById } from '@/http/firebase'

const HINT_COMMMAND = '!dica'

const nextTextMessage = async (dm: DMChannel, interaction: CommandInteraction): Promise<string> => {
  try {
    const result = await dm.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      time: TIMEOUT_ANSWER,
      max: 1,
    })

    return result.first()!.content
  } catch {
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
    description: QUIZ.CONTINUE,
  })

  await dm.send({ embeds: [myEmbed] })
  await nextMultipleRoleSelection(roles, text, dm, member, interaction)
}

const nextStringsData = async (dm: DMChannel, interaction: CommandInteraction, client: He4rtClient, eventId: string): Promise<void> => {
  
  const quizzes = await getEventQuizzesById(client, eventId)

  for (const quiz of quizzes) {
    const embed = embedTemplate({ title: quiz.title, description: quiz.question })
    await dm.send({ embeds: [embed] })

    const wrongResponse = createEmbedResponse(COLORS.ERROR as HexColorString, 'Excelente tentativa, mas a resposta não está correta.', 'Essa foi a resposta errada.')
    const rightResponse = createEmbedResponse(COLORS.SUCCESS as HexColorString, 'Ótima resposta, aqui vai a próxima!', `Respostas: **${quiz.answer}**`)
    const hintResponse = createEmbedResponse(COLORS.HINT_ANSWER as HexColorString, quiz.tip)
    const finishEventResponse = createEmbedResponse(null, 'Parabéns!! você conseguiu concluir o evento🎉🎉🎉')


    async function handleUserInput() {
      const userInput = await nextTextMessage(dm, interaction)
      const regex = new RegExp('\\b' + userInput.toLowerCase() + '\\b');

      const inputResult = userInput === HINT_COMMMAND ? 'hint'
        : !regex.test(quiz.answer.toLowerCase()) ? 'retry'
        : quiz.has_next_question ? 'continue' : 'finished'
      
        const actions = {
        hint: () => dm.send({embeds: [hintResponse]}),
        retry: () => {
          dm.send('💥')
          dm.send({embeds: [wrongResponse]})
        },
        continue: () => dm.send({ embeds: [rightResponse]}),
        finished: () => dm.send({ embeds: [finishEventResponse]})
      }

      const result = actions[inputResult] || actions.finished
      result()

      if(inputResult === 'hint' || inputResult === 'retry')
        await handleUserInput()

    }

    await handleUserInput()
  }
}

const validateAccess = async (dm: DMChannel, interaction: CommandInteraction): Promise<boolean> => {
  const myEmbed = embedTemplate({
    title: 'Evento de programação',
    description: QUIZ.CONTINUE,
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

          const channel = getChannel({ id: QUIZ_EVENT.id, client })
          const claimedReward = await claimEventReward(client, activeEventId, interaction.user.id)
          await member.roles.add(claimedReward.badge)

          let participantMessage = QUIZ.REWARD_PARTICIPANT
          participantMessage = participantMessage
            .replace('{user}', `${author.username}`)
            .replace('{exp}', `${claimedReward.he4rt_xp} XP`)

          const participantEmbed = embedTemplate({title: participantMessage})
          
          const winnerEmbed = embedTemplate({
            title: `${author.username} conseguiu responder todas as perguntas com sucesso!`,
            description: `Como recompensa do ${places[claimedReward.place]} lugar ganhou **${claimedReward.he4rt_xp}** de experiência!`
          })

          claimedReward.place !== 'participant'
          ? channel.send({ embeds: [winnerEmbed] })
          : dm.send({ embeds: [(participantEmbed)]})
            
        })
        .catch(() => {})
        .finally(async () => {})
    },
  ]
}

const createEmbedResponse = (color: HexColorString, title: string, description?: string) => embedTemplate({
    title,
    description,
    color
})
