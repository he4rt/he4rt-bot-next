import { TickerCallback } from '@/types'

export class Ticker {
  private _list: TickerCallback[] = []
  private _interval: NodeJS.Timer

  constructor() {}

  public add(cb: TickerCallback) {
    this._list.push(cb)
  }

  public remove(cb: TickerCallback) {
    const index = this._list.indexOf(cb)

    if (index !== -1) this._list.splice(index, 1)
  }

  public start(cbs?: TickerCallback[]): Promise<void> {
    return new Promise((res) => {
      if (cbs) this._list.push(...cbs)

      this._interval = setInterval(() => {
        this._list.forEach((cb) => cb && cb())
      }, 1000)

      res()
    })
  }

  public clear() {
    clearInterval(this._interval)
    this._interval = null
  }
}
