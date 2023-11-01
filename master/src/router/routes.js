import { main } from 'fwk-q-main'
import Home from '../pages/home/index.vue'

const routes = [
    { path: '/', component: Home },
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue')
    }
]
// main.actions.initBeforeRoutes(routes[0].children)
export default routes
