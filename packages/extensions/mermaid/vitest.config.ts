import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      mermaid: path.resolve(__dirname, 'src/__mocks__/mermaid.ts'),
    },
  },
})
