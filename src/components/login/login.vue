<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin()" class="login-button" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
    handleLogin() {
      this.$http.post('login', this.formdata).then(res => {
        console.log(res)
      })
      if (res.data.status === 200){
        this.router.push({name: 'home'})
      }
    }
  }
}
</script>

<style scoped>
.login-wrap{
  height: 100%;
  background-color: black;
  /* 弹性盒布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form{
  width: 400px;
  background-color: white;
  border-radius: 5px;
  padding: 30px;
}
</style>
