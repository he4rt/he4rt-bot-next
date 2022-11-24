import { defineConfig } from 'tsup'
import { replace } from 'esbuild-plugin-replace'

export default defineConfig({
  entry: ['src/index.ts'],
  target: ['node16'],
  clean: true,
  sourcemap: true,
  watch: true,
  esbuildPlugins: [
    replace({
      'ids.json': 'ids_development.json'
    })
  ]
})
