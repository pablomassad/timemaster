import { main } from 'fwk-q-main'
import Home from 'src/pages/home/index.vue'
import Hours from 'src/pages/hours/index.vue'
import Report from 'src/pages/report/index.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/hours', component: Hours },
    { path: '/report', component: Report },
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue')
    }
]
// main.actions.initBeforeRoutes(routes[0].children)
export default routes
