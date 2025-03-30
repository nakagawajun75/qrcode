<template>
  <div class="login-container">
    <h2>商家登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>用户名：</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>密码：</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="error" style="color:red;">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await axios.post('http://localhost:3000/api/businesses/login', {
          username: this.username,
          password: this.password
        })
        const token = res.data.token
        // 保存 token 到 localStorage
        localStorage.setItem('token', token)
        // 跳转到菜单页面
        this.$router.push('/Menu')
      } catch (err) {
        this.error = err.response.data.error || '登录失败'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>