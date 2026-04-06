import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './apps/demo/e2e',
  webServer: {
    command: 'pnpm --filter @verso-editor/demo dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
})
