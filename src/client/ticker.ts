import { TickerCallback, TickerItem, TickerName } from '@/types'

export class Ticker {
  private _list: TickerItem[] = []
  private _interval: NodeJS.Timer

  private __CALL__: number = 1000

  constructor() {}

  public add(name: TickerName, cb: TickerCallback) {
    this._list.push([name, cb])
  }

  public remove(i: TickerItem) {
    const index = this._list.indexOf(i)

    if (index !== -1) this._list.splice(index, 1)
  }

  public start(): Promise<void> {
    return new Promise((res) => {
      this._interval = setInterval(() => {
        this._list.forEach(async ([_, cb]) => cb && cb())
      }, this.__CALL__)

      res()
    })
  }

  public clear() {
    clearInterval(this._interval)
    this._interval = null
  }
}
