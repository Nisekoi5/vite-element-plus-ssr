import { createSSRApp, createApp as _createApp } from 'vue'
import { createPinia  } from 'pinia'
import test_app from './App.vue'
import create_router from './router/routes.js'



export function createApp(history, ssr = true) {
  const app = ssr ? createSSRApp(test_app) : _createApp(test_app);
  const router = create_router(history)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  return { app, router, pinia }
}