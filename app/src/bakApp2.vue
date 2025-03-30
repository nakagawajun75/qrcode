<!-- src/App.vue -->
<template>
  <div id="app">
    <Login />
  </div>
</template>

<script>
	
import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Menu from './views/Menu.vue'
export default {
  name: 'App',
  components: {
	 Login,
    Menu // 注册 Menu 组件
  }
}
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login  // 设置登录页面的路径
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu  // 设置商家菜单页面的路径
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
</script>




<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>