import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Login from '../views/Login.vue';  // 登录页面
import Menu from '../views/Menu.vue';    // 商家菜单页面
import GuestMenuAbc from '../views/GuestMenuAbc.vue'
import GuestMenuDef from '../views/GuestMenuDef.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login  // 映射到登录页面
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu  // 映射到商家菜单页面
  },
  {
 	path: '/guestmenu/abc',
    name: 'GuestMenuAbc',
    component: GuestMenuAbc  // 映射到商家菜单页面
  }
  ,
  {
 	path: '/guestmenu/def',
    name: 'GuestMenuDef',
    component: GuestMenuDef  // 映射到商家菜单页面
  }
];

// 创建 Vue Router 实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // 使用 HTML5 History 模式
  routes
});

export default router;  // 导出 router 实例