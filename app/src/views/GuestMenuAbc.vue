<template>
  <div class="menu-container">
    <h2>客人菜单</h2>
    <div v-if="loading">加载中...</div>
    <div v-else>
      <ul v-if="menuItems.length">
        <li v-for="item in menuItems" :key="item.id">
          <h3>{{ item.name }} - ￥{{ item.price }}</h3>
          <p>{{ item.description }}</p>
          <p><img :src="item.image_url" alt="Sample" width="300" height="200"></p>
        </li>
      </ul>
      <p v-else>没有菜品数据，请先添加菜品。</p>
    </div>
    <button type="reset">戻る</button>           <button type="reset">等等</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'GuestMenu',
  data() {
    return {
      menuItems: [],
      loading: true,
      error: ''
    }
  },
  async created() {
    try {
		console.log("TESTINIT");
      const res = await axios.get('http://localhost:3000/api/guestmenu/', {
		params:{
			  "businessId":4,
			  "tableId":1
		}
      })
      console.log(res);
      this.menuItems = res.data
    } catch (err) {
      this.error = err.response.data.error || '加载菜单失败'
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.menu-container {
  max-width: 800px;
  margin: 20px auto;
}
</style>