import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { CODE } from '@/defines/commands.json'
import { reply } from '@/utils'

export const useCode = (): Command => {
  const data = new SlashCommandBuilder().setName(CODE.TITLE).setDescription(CODE.DESCRIPTION).setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const answer = String.raw`
      Formate seu código:
      \`\`\`js
          CÓDIGO AQUI
      \`\`\`
Troque o **js** por sua linguagem
      `

      const example = '```js\n\
const foo = 10;\
    ```\
    '

      await interaction.channel.send(`${answer}\n${example}`)

      await reply(interaction).success()
    },
  ]
}
