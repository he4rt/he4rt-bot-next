import { TickerCallback } from '@/types'

export class Ticker {
  private _list: TickerCallback[] = []
  private _interval: NodeJS.Timer

  private __CALL__: number = 1000

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
        this._list.forEach(async (cb) => cb && cb())
      }, this.__CALL__)

      res()
    })
  }

  public clear() {
    clearInterval(this._interval)
    this._interval = null
  }
}
