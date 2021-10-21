import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import CreateGame from "../components/CreateGame.vue";
import JoinGame from "../components/JoinGame.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/create",
    component: CreateGame
  },
  {
    path: "/join",
    component: JoinGame
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
