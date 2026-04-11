import { defineConfig } from 'vitepress'

export default defineConfig({
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
