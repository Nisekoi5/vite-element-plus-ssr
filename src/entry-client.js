import { createWebHistory } from 'vue-router'
import { createApp } from './main.js'
import { useCounterStore } from '@/stores/index'



const { app, router, pinia } = createApp(createWebHistory())

router.isReady().then(() => {
    app.mount('#app')
})

