import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: '/index.html',
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        bubble: resolve(__dirname, 'bubble.html'),
      },
      external: [/prosemirror-.*/, 'mermaid'],
    },
  },
})
