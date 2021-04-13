<template>
  <el-container class="container">
    <el-header class="header" style="height: 70px">
      <el-row type="flex" align="middle">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img class="logo" src="../../assets/logo.png" alt="无法显示图片">
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <div class="grid-content bg-purple-light">
            <h2 style="color: white">社交网络数据分析系统</h2>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-button class="exit-button" circle @click="handleSignout()" type="plain" icon="el-icon-switch-button"></el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <el-menu :router="true" :unique-opened="true">
          <el-submenu :index="''+item1.order" v-for="(item1, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.name}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2, index) in item1.children" :key="index">
              <i class="el-icon-menu"></i>
              <span>{{item2.name}}</span>
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
  data() {
    return {
      menus: [],
      // 管理员用户菜单
      menus_admin: [
        {
          name: "用户管理",
          path: "users",
          children: [
            {
              name: "用户列表",
              path: "users",
              order: 1,
            },
          ],
          order: 1,
        },
        {
          name: "案件管理",
          path: "cases",
          children: [
            {
              name: "案件列表",
              path: "cases",
              order: 1,
            },
          ],
          order: 2,
        },
        {
          name: "人员管理",
          path: "persons",
          children: [
            {
              name: "人员列表",
              path: "persons",
              order: 1,
            },
          ],
          order: 3,
        },
        {
          name: "手机管理",
          path: "phones",
          children: [
            {
              name: "手机列表",
              path: "phones",
              order: 1,
            },
          ],
          order: 4,
        },
        {
          name: "通讯记录",
          path: "wechats",
          children: [
            {
              name: "微信",
              path: "wechats",
              order: 1,
            },
            {
              name: "QQ",
              path: "5-2",
              order: 2,
            },
            {
              name: "短信",
              path: "5-3",
              order: 3,
            },
          ],
          order: 5,
        },
        {
          name: "识别结果",
          path: "fapiaos",
          children: [
            {
              name: "发票",
              path: "fapiaos",
              order: 1,
            },
            {
              name: "身份证",
              path: "5-2",
              order: 2,
            },
          ],
          order: 6,
        },
      ],
      // 普通用户菜单
      menus_user: [
        {
          name: "案件管理",
          path: "cases",
          children: [
            {
              name: "案件列表",
              path: "cases",
              order: 1,
            },
          ],
          order: 1,
        },
        {
          name: "人员管理",
          path: "persons",
          children: [
            {
              name: "人员列表",
              path: "persons",
              order: 1,
            },
          ],
          order: 2,
        },
        {
          name: "手机管理",
          path: "phones",
          children: [
            {
              name: "手机列表",
              path: "phones",
              order: 1,
            },
          ],
          order: 3,
        },
        {
          name: "通讯记录",
          path: "wechats",
          children: [
            {
              name: "微信",
              path: "wechats",
              order: 1,
            },
            {
              name: "QQ",
              path: "4-2",
              order: 2,
            },
            {
              name: "短信",
              path: "4-3",
              order: 3,
            },
          ],
          order: 4,
        },
        {
          name: "识别结果",
          path: "fapiaos",
          children: [
            {
              name: "发票",
              path: "fapiaos",
              order: 1,
            },
            {
              name: "身份证",
              path: "5-2",
              order: 2,
            },
          ],
          order: 5,
        },
      ],
    };
  },
  created() {
    this.getMenus();
  },
  // newVue之前触发
  beforeCreate() {},
  methods: {
    getMenus() {
      if (localStorage.getItem("token") === "admin") {
        this.menus = this.menus_admin;
      } else {
        this.menus = this.menus_user;
      }
    },
    handleSignout() {
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(0, 0, 0, 0.15) 100%
    ),
    radial-gradient(
        at top center,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(0, 0, 0, 0.4) 120%
      )
      #989898;
  background-blend-mode: multiply, multiply;
}
.aside {
  background-image: linear-gradient(
    to top,
    #d5d4d0 0%,
    #d5d4d0 1%,
    #eeeeec 31%,
    #efeeec 75%,
    #e9e9e7 100%
  );
}
.main {
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
/* 头部样式 */
.middle {
  text-align: center;
}
.logo {
  width: 60px;
}
</style>
