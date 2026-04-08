import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.tsx',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [/prosemirror-.*/, '@verso-editor/core', 'react', 'react-dom'],
    },
  },
  plugins: [dts()],
})
