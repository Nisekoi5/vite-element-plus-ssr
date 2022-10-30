import { createRouter } from 'vue-router'


const routes = [
    {
        path: '/test',
        name: 'test',
        component: () => import('../test.vue'),
    }

]
// 111
// 222
// 333
// 444
export default function (history) {
    // console.log(routes)
    return createRouter({
        'history': history,
        routes
    })
}

