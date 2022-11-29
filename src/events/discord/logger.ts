import { He4rtClient } from '@/types'

export const emitDefaultDiscordError = (client: He4rtClient, { name, message }: Error) => {
  client.logger.emit({
    message: `Um erro genérico foi emitido!: **[${name}]** - ${message}`,
    type: 'discord',
    color: 'error',
  })
}
