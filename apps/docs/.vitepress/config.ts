import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        mermaid: resolve(__dirname, 'stubs/mermaid.ts'),
      },
    },
    build: {
      rollupOptions: {
        external: [/prosemirror-.*/, 'mermaid'],
      },
    },
  },
  title: 'Verso Editor',
  description: 'A modular, extensible rich text editor built on ProseMirror',
  base: '/verso-editor/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Extensions', link: '/guide/extensions' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: '/playground/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Extensions', link: '/guide/extensions' },
            { text: 'Advanced Extensions', link: '/guide/advanced-extensions' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [{ text: 'Overview', link: '/api/' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/anthropics/verso-editor' }],
  },
})
