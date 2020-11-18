<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img class="logo" src="../../assets/logo.png" alt="无法显示图片">
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <div class="grid-content bg-purple-light">
            <h3>前端主页头部</h3>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-button class="exit-button" @click="handleSignout()" type="primary">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <el-menu
          :router="true"
          :unique-opened="true">
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-apple"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-apple"></i>
              <span>选项一</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航三</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-apple"></i>
              <span>选项一</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航四</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-apple"></i>
              <span>选项一</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航五</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-apple"></i>
              <span>选项一</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // newVue之前触发
  beforeCreate() {
    const token = localStorage.getItem('token')
    if (!token) {
      // this.$router.push({name: 'login'})
    }
  },
  methods: {
    handleSignout() {
      localStorage.clear()
      this.$message.success("退出成功")
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped>
.container{
  height: 100%;
}
.header{
  background-color: grey;
}
.aside{
  background-color: #aaaaaa;
}
.main{
  background-color: #bbbbbb;
}
/* 头部样式 */
.middle{
  text-align: center;
}
.exit-button{

}
.logo{
  width: 60px;
}
</style>
