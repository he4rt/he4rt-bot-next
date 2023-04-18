import fg from 'fast-glob'
import path from 'path'
import { Command } from './types';

// this will be used for import components when ts-import or run pm2 with ts-node.
export const getHookCommands = (): Promise<Command[]> => {
  const cwd = path.resolve(__dirname, '../src/commands')
  const paths = fg.sync(['**/*.ts'], { cwd })

  return new Promise((res, rej) => {
    const hooks: Command[] = []

    try {
      paths.forEach(path => {
        const filepath = `${cwd}/${path}`.replace(/.[jt]s$/, '')

        import(filepath).then((contents: Record<`use${string}` | string, Command>) => {
          const onlyHooks = Object.entries(contents).filter(([key]) => key.match(/^use(.*)/i))
          const fnHooks = onlyHooks.map(([_, content]) => content)
  
          hooks.push(...fnHooks)
        });
      })
    } catch(err) {
      rej(err)
    }

    res(hooks)
  })
}