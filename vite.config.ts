import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'


const pathSrc = path.resolve(__dirname, 'src')
console.log('VITE-SSR: ',process.env.vite_build ? false : true)
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [
    vue(),
    // ElementPlus(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [
        ElementPlusResolver({ ssr: process.env.vite_build ? false : true, importStyle: 'css' })
      ],
      vueTemplate: true,
      dts: path.resolve(pathSrc, 'typings', 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ ssr: process.env.vite_build ? false : true, importStyle: 'css' })
      ],
      directives: true,
      // directoryAsNamespace:true,
      dts: path.resolve(pathSrc, 'typings', 'components.d.ts'),
    }),
    Icons(
      { autoInstall: true }
    ),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    cors: true,
    // hmr:true,
    proxy: {
      "/api_v1/": {
        target: {
          protocol: 'http:',
          host: '127.0.0.1',
          port: 4396,
        },
        changeOrigin: true,
      },
      "/static/": {
        target: {
          protocol: 'http:',
          host: '127.0.0.1',
          port: 4396,
        },
        changeOrigin: true,
      }
    }
  },
  ssr: {
    // noExternal: ['vue-clipboard3']
  },
  optimizeDeps: {
    include: ['vue-clipboard3']
  }
})
