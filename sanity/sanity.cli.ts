import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '3vpl3hho',
    dataset: 'production',
    apiVersion: '2023-05-03', // ✅ Correct API version
  },
  deployment: {
    appId: 'utjxosic0t2z1hhcr38eotao',
  },
})

