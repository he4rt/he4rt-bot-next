import { He4rtClient, LoggerEmitOptions } from '@/types'
import { getBotVersion, getChannel, getGuild, getUserAvatar } from '@/utils'
import { EmbedBuilder, Guild, HexColorString, TextBasedChannel } from 'discord.js'
import { REPORT_CHANNEL } from '@/defines/ids.json'
import { COLORS, CLIENT_NAME } from '@/defines/values.json'

export class Logger {
  private _client: He4rtClient
  private _guild: Guild
  private _receiver: TextBasedChannel

  constructor(client: He4rtClient) {
    this._client = client
    this._guild = getGuild(client)
    this._receiver = getChannel({ id: REPORT_CHANNEL.id, client })
  }

  public emit(options: LoggerEmitOptions) {
    if (!this._client || !this._guild || !this._receiver) return

    const embed = new EmbedBuilder()
    embed.setAuthor({
      name: CLIENT_NAME,
      iconURL: getUserAvatar(this._client.user),
    })

    if (options.user) {
      embed.setThumbnail(getUserAvatar(options.user))
    }

    switch (options.type) {
      case 'bot':
        embed.setTitle('Geral')
        break
      case 'http':
        embed.setTitle('Requisição HTTP')
        break
      case 'command':
        embed.setTitle('Comando')
        break
      case 'apoiase':
        embed.setTitle('Apoia.se')
        break
      case 'event':
        embed.setTitle('Evento')
        break
    }

    embed.setDescription(`${options.message}`)

    switch (options.color) {
      case 'success':
        embed.setColor(COLORS.SUCCESS as HexColorString)
        break
      case 'error':
        embed.setColor(COLORS.ERROR as HexColorString)
        break
      case 'warning':
        embed.setColor(COLORS.WARNING as HexColorString)
        break
      case 'info':
        embed.setColor(COLORS.INFO as HexColorString)
        break
    }

    embed.setTimestamp()

    this._receiver?.send({ embeds: [embed] })
  }
}

export const registerLogger = (client: He4rtClient) => {
  client.logger = new Logger(client)

  client.logger.emit({
    type: 'bot',
    color: 'info',
    message: `**BOT ON! ${getBotVersion()}**`,
  })
}
