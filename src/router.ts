import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: "/",
        component: () => import("./views/Character.vue"),
        children: [
            {path: "actions/:category", component: () => import("./views/Actions.vue")}
        ]
    }
]

export default createRouter({ history: createWebHistory(), routes })
