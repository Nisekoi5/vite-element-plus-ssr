import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/test',
        name: 'test',
        component: () => import('./test.vue'),
    }

]
const app = createApp(App)
const router = createRouter({
    'history': createWebHistory(),
    routes
})
app.use(router)
app.mount('#app')
