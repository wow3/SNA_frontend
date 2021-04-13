<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>手机管理</el-breadcrumb-item>
      <el-breadcrumb-item>手机列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <h5>条件筛选（模糊）</h5>
    </el-row>
    <el-row>
      <el-input placeholder="手机型号" v-model="query.name" class="inputSearch" clearable style="width: 150px;">
      </el-input>
    </el-row>
    <el-row>
      <el-input placeholder="手机号码" v-model="query.phone" class="inputSearch" clearable style="width: 150px;">
      </el-input>
      <el-button type="primary" @click="searchPhone()" icon="el-icon-search">检索</el-button>
    </el-row>
    <el-divider></el-divider>
    <!-- 表格 -->
    <el-table :data="phonelist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
      <el-table-column fixed prop="id" label="编号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="手机型号" width="200">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="200">
      </el-table-column>
      <el-table-column prop="person_name" label="人员姓名" width="200">
      </el-table-column>
      <el-table-column prop="data_path" label="手机资料地址" width="200">
      </el-table-column>
      <el-table-column fixed prop="op" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showPhoneInfoDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditPhoneDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeletePhoneMsgBox(scope.row.id)"></el-button>
          <el-button size="mini" plain type="warning" icon="el-icon-folder-add" circle @click="showFileLoader(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框     -->
    <!-- 修改手机的对话框 -->
    <el-dialog title="修改手机信息" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="手机型号" label-width="100px">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入手机型号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="100px">
          <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="人员姓名" label-width="100px" :disabled="true">
          <el-input v-model="form.person_name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机资料存放地址" label-width="100px">
          <el-input v-model="form.data_path" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="其他信息" label-width="100px">
          <el-input v-model="form.more" autocomplete="off" type="textarea" :rows="15" placeholder="文本项：按一定格式输入，以利于查询和统计"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editPhone()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 手机详情信息的对话框 -->
    <el-dialog title="手机信息" :visible.sync="dialogFormVisibleInfo">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>手机型号</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.name}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>手机号码</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.phone}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>人员姓名</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.person_name}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>手机资料存放地址</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.data_path}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px;" shadow="hover">
          <el-row>
            <h4>更多信息</h4>
          </el-row>
          <el-row>
            <div>{{form.more}}</div>
          </el-row>
        </el-card>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleInfo = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 导入手机原始资料对话框 -->
    <el-dialog title="手机原始资料导入" :visible.sync="dialogFileLoaderVisible">
      <el-row>
        <el-input v-model="filepath" placeholder="请输入原始资料地址（绝对路径）"></el-input>
      </el-row>
      <el-row>
        <el-button type="primary" @click="loadFile()">导入</el-button>
      </el-row>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      filepath: "",
      query: {
        name: "",
        phone: "",
      },
      phonelist: [],
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleEdit: false,
      dialogFormVisibleInfo: false,
      dialogFileLoaderVisible: false,
      // 添加用户的表单数据
      form: {
        id: "",
        name: "",
        phone: "",
        data_path: "",
        more: "",
      },
    };
  },
  created() {
    this.getPhoneList();
  },
  methods: {
    // 导入原始数据
    async loadFile() {
      const res = await this.$http.post(
        `loadfile`, 
        "phone_id=" + this.form.id + "&phone_name=" + this.form.name + "&fliepath=" + this.filepath
      );
      if (res.data.status_code === 201) {
        this.$notify.info({
          title: "提示！",
          message: "数据拷贝中，请勿关闭计算机或操作相关文件",
          duration: 0
        })
      } else if (res.data.status_code === 401) {
        this.$notify.error({
          title: "错误！",
          message: "原始数据路径不可用！",
          duration: 0
        })
      } else {
        this.$notify.error({
          title: "错误！",
          message: "未知错误",
          duration: 0
        })
      }
    },
    // 导入手机原始数据 - 显示对话框
    showFileLoader(cur_phone) {
      this.dialogFileLoaderVisible = true;
      this.form = cur_phone;
    },
    // 查看手机详情 - 绑定数据，显示对话框
    showPhoneInfoDialog(cur_phone) {
      this.form = cur_phone;
      this.dialogFormVisibleInfo = true;
    },
    // 编辑手机 - 发送请求
    async editPhone() {
      // 1.关闭对话框
      this.dialogFormVisibleEdit = false;
      const res = await this.$http.post(
        `editphone`,
        "id=" +
          this.form.id +
          "&name=" +
          this.form.name +
          "&phone=" +
          this.form.phone +
          "&more=" +
          this.form.more
      );
      // 2.更新视图
      this.getPhoneList();
      // 3.显示提示
      if (res.data.status_code === 201) {
        this.$message.success("修改成功！");
      } else {
        this.$message.info("修改失败！");
      }
      this.form = {};
    },
    // 编辑手机 - 显示对话框
    showEditPhoneDialog(cur_phone) {
      // 获取用户数据
      this.form = cur_phone;
      this.dialogFormVisibleEdit = true;
    },
    // 删除手机 - 打开消息盒子
    showDeletePhoneMsgBox(phoneId) {
      this.$confirm("删除手机？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post(`delphone`, "id=" + phoneId);
          if (res.data.status_code === 201) {
            this.getPhoneList();
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
    // 搜索手机
    searchPhone() {
      this.getPhoneList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getPhoneList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getPhoneList();
    },
    // 获取人员列表的请求
    async getPhoneList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `phones`,
        "name=" +
          this.query.name +
          "&phone=" +
          this.query.phone +
          "&pagenum=" +
          this.pagenum +
          "&pagesize=" +
          this.pagesize
      );
      this.phonelist = res.data.phonelist;
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
.el-row {
  margin-bottom: 20px;
}
.add-button {
  margin-top: 30px;
}
</style>




