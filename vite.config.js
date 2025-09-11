/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './', // Используем относительные пути для билда
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/shared/styles/index" as *;\n`
      }
    }
  }
})
