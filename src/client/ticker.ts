import { TickerCallback, TickerItem, TickerName } from '@/types'

export class Ticker {
  private _list: TickerItem[] = []
  private _interval: NodeJS.Timer

  private __CALL__: number = 1000

  constructor() {}

  public add(name: TickerName, cb: TickerCallback) {
    this._list.push([name, cb])
  }

  public remove(target: TickerName) {
    this._list = this._list.filter(([name]) => name !== target)
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

  public restart() {
    this.clear()
    this.start()
  }
}
