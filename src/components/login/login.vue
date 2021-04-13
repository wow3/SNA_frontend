<template>
  <div class="login-wrap">
    <el-card class="login-card">
      <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <div class="login-title">
          <h2>用户登录</h2>
        </div>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="formdata.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleLogin()" class="login-button" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    handleLogin() {
      this.$http
        .post(
          "login",
          "username=" +
            this.formdata.username +
            "&password=" +
            this.formdata.password
        )
        .then((response) => {
          if (response.data.msg === "login_success") {
            this.$message.success("登录成功！");
            localStorage.setItem("token", response.data.token);
            this.$router.push({ name: "cases" });
          } else if (response.data.msg === "user_not_exist") {
            this.$message.warning("用户名不存在！");
          } else if (response.data.msg === "verify_fail") {
            this.$message.error("身份验证失败，请确认用户名和密码！");
          } else {
            this.$message.error("登录失败！");
          }
        });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  background: url("../../assets/background.jpg");
  /* background: url("../../assets/background_v2.png"); */
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  background-color: rgba(200, 200, 200, 0.97);
  border-color: rgba(200, 200, 200, 0.97);
  border-radius: 20px;
  position: absolute;
  top: 20%;
  left: 10%;
}
.login-form {
  width: 320px;
  padding: 30px;
}
.login-button {
  float: right;
}
</style>
