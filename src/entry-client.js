import { createWebHistory } from 'vue-router'
import { createApp } from './main.js'



const { app, router, pinia } = createApp(createWebHistory())

router.isReady().then(() => {
    app.mount('#app')
})

