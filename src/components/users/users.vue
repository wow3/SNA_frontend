<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入用户名关键字" v-model="query" class="inputSearch" clearable>
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="userlist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
      <el-table-column prop="id" label="ID" width="80"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="150">
      </el-table-column>
      <el-table-column prop="department" label="部门" width="150">
      </el-table-column>
      <el-table-column prop="status" label="用户状态" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="op" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleteUserMsgBox(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框     -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="80px">
          <el-input v-model="form.department" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="80px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="80px">
          <el-input v-model="form.department" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      query: "",
      userlist: [],
      // 分页相关数据
      pagenum: 1,
      pagesize: 4,
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      // 添加用户的表单数据
      form: {
        username: "",
        password: "",
        phone: "",
        department: "",
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 修改状态
    async changeStatus(user) {
      // 发送请求
      const res = await this.$http.post(`chstatus`, "id=" + user.id + "&status=" + user.status);
      if (res.data.status_code === 201) {
        this.$message.success("设置状态成功！");
      } else {
        this.$message.info("设置状态失败！");
      }
    },
    // 编辑用户 - 发送请求
    async editUser() {
      // 1.关闭对话框
      this.dialogFormVisibleEdit = false;
      const res = await this.$http.post(
        `edituser`,
        "id=" +
          this.form.id +
          "&phone=" +
          this.form.phone +
          "&department=" +
          this.form.department
      );
      // 2.更新视图
      this.getUserList();
      // 3.显示提示
      if (res.data.status_code === 201) {
        this.$message.success("编辑成功！");
      } else {
        this.$message.info("编辑失败！");
      }
    },
    // 编辑用户 - 显示对话框
    showEditUserDialog(user) {
      // 获取用户数据
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    // 删除用户 - 打开消息盒子
    showDeleteUserMsgBox(userId) {
      this.$confirm("删除用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post(`deluser`, "id=" + userId);
          console.log(res);
          if (res.data.status_code === 201) {
            this.getUserList();
            this.$message({
              type: "success",
              message: "删除成功！",
            });
          } else {
            this.$message({
              type: "info",
              message: "删除失败！",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 添加用户 - 发送请求
    async addUser() {
      // 1.关闭对话框
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post(
        "users",
        "username=" +
          this.form.username +
          "&password=" +
          this.form.password +
          "&phone=" +
          this.form.phone +
          "&department=" +
          this.form.department
      );
      console.log(res);
      if (res.data.status_code === 201) {
        // 2.提示成功
        this.$message.success(res.data.msg);
        // 3.更新数据
        this.getUserList();
        // 4.清空文本
        this.form = {};
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 添加用户 - 显示对话框
    showAddUserDialog() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 搜索用户
    searchUser() {
      this.getUserList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
    // 获取用户列表的请求
    async getUserList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        // `users`
      );
      console.log(res);
      this.userlist = res.data.userlist;
      this.total = res.data.total;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>
