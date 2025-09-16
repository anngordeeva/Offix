/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

export default defineConfig({
  base: './', 
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/shared/assets', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/shared/styles/index" as *;\n`
      }
    }

  },
  build:{
    rollupOptions:{
      input: {
        "index": resolve(__dirname, './index.html'),
        "page.home": resolve(__dirname, './src/pages/home.html'),
        "page.virtual-office": resolve(__dirname, './src/pages/virtual-office.html'),
        "page.offices": resolve(__dirname, './src/pages/offices.html')
      }
    }
  }
})
