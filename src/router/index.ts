import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import CreateGame from "../views/CreateGame.vue";
import JoinGame from "../views/JoinGame.vue";
import JoinPage from "../views/JoinPage.vue";
import AdminPage from "../views/AdminPage.vue";

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
  },
  {
    path: "/join/:id",
    component: JoinPage
  },
  {
    path: "/admin",
    component: AdminPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
