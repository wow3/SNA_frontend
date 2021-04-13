<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>案件管理</el-breadcrumb-item>
      <el-breadcrumb-item>案件列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入案件关键字" v-model="query" class="inputSearch" clearable>
          <el-button @click="searchCase()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddCaseDialog()">添加案件</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="caselist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
      <el-table-column prop="id" label="案件编号" width="150"> </el-table-column>
      <el-table-column prop="casename" label="案件名称" width="600">
      </el-table-column>

      <el-table-column prop="op" label="操作">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="案件详情" placement="top" :open-delay=600>
            <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showCaseInfoDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑案件" placement="top" :open-delay=600>
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditCaseDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除案件" placement="top" :open-delay=600>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleteCaseMsgBox(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="涉案人员" placement="top" :open-delay=600>
            <el-button size="mini" plain type="warning" icon="el-icon-user" circle @click="showCasePerson(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框     -->
    <!-- 添加案件的对话框 -->
    <el-dialog title="添加案件" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="案件名称" label-width="80px">
          <el-input v-model="form.casename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="案件简介" label-width="80px">
          <el-input v-model="form.caseinfo" autocomplete="off" type="textarea" :rows="15" placeholder="请输入案件简介（自由填写有关时间，地点，性质，状态等）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCase()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改案件的对话框 -->
    <el-dialog title="修改案件" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="案件名称" label-width="80px">
          <el-input v-model="form.casename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="案件简介" label-width="80px">
          <el-input v-model="form.caseinfo" autocomplete="off" type="textarea" :rows="15" placeholder="请输入案件简介（自由填写有关时间，地点，性质，状态等）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCase()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 案件详情信息的对话框 -->
    <el-dialog title="案件信息" :visible.sync="dialogFormVisibleInfo">
      <el-card style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card class="card-bg" style="margin-bottom: 30px;" shadow="hover">
          <el-row>
            <h4>案件名称</h4>
          </el-row>
          <el-row>
            <div>{{form.casename}}</div>
          </el-row>
        </el-card>
        <el-card shadow="hover">
          <el-row>
            <h4>案件简介</h4>
          </el-row>
          <el-row>
            <div>{{form.caseinfo}}</div>
          </el-row>
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleInfo = false">关 闭</el-button>
        </div>
      </el-card>
    </el-dialog>
    <!-- 涉案人员对话框 -->
    <el-dialog title="涉案人员" :visible.sync="dialogPersons" width="1000px">
      <!-- 表格 -->
      <el-card>
        <el-table :data="personlist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
          <el-table-column fixed prop="id" label="编号" width="100">
          </el-table-column>
          <el-table-column fixed prop="name" label="姓名" width="100">
          </el-table-column>
          <el-table-column prop="idf" label="身份证号码" width="200">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" width="150">
          </el-table-column>
          <el-table-column prop="nation" label="民族" width="100">
          </el-table-column>
          <el-table-column prop="native_province" label="籍贯（省）" width="100">
          </el-table-column>
          <el-table-column prop="address" label="住址" width="350">
          </el-table-column>
          <el-table-column prop="role" label="角色" width="100">
          </el-table-column>
          <el-table-column fixed prop="op" label="操作" width="140">
            <template slot-scope="scope">
              <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showPersonInfoDialog(scope.row)"></el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-mobile-phone" circle @click="showPersonPhone(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!-- 特定涉案人员手机列表对话框 -->
    <el-dialog title="手机列表" :visible.sync="dialogPhones" width="1000px">
      <!-- 表格 -->
      <el-card>
        <el-table :data="phonelist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
          <el-table-column fixed prop="id" label="编号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="手机型号" width="200">
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" width="200">
          </el-table-column>
          <el-table-column prop="data_path" label="手机资料地址" width="200">
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!-- 涉案人员详情对话框 -->
    <el-dialog title="人员信息" :visible.sync="dialogPersonInfo">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>姓名</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.name}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>性别</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.gender}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>身份证号码</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.idf}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>民族</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.nation}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>籍贯</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.native_province}} {{personform.native_city}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>生日</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.birthday}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>住址</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.address}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>角色</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{personform.role}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px;" shadow="hover">
          <el-row>
            <h4>更多信息</h4>
          </el-row>
          <el-row>
            <div>{{personform.more}}</div>
          </el-row>
        </el-card>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleInfo = false">关 闭</el-button>
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
      caselist: [],
      personlist: [],
      phonelist: [],
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleInfo: false,
      dialogPersons: false,
      dialogPhones: false,
      dialogPersonInfo: false,
      // 添加用户的表单数据
      form: {
        casename: "",
        caseinfo: "",
      },
      personform: {},
    };
  },
  created() {
    this.getCaseList();
  },
  methods: {
    // 打开查看特定人员手机对话框
    showPersonPhone(person_id) {
      this.getPhoneList(person_id);
      this.dialogPhones = true;
    },
    // 获取特定人员手机列表信息
    async getPhoneList(person_id) {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `phonesofperson`,
        "person_id=" + person_id
      );
      this.phonelist = res.data.phonelist;
    },
    // 打开涉案人员详细信息对话框
    showPersonInfoDialog(cur_person) {
      this.personform = cur_person;
      this.dialogPersonInfo = true;
    },
    // 打开涉案人员对话框
    showCasePerson(case_id) {
      this.getPersonList(case_id);
      this.dialogPersons = true;
    },
    // 获取涉案人员数据
    async getPersonList(case_id) {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(`personsincase`, "case_id=" + case_id);
      this.personlist = res.data.personlist;
    },
    // 查看案件详情 - 绑定数据，显示对话框
    showCaseInfoDialog(cur_case) {
      this.form = cur_case;
      this.dialogFormVisibleInfo = true;
    },
    // 编辑案件 - 发送请求
    async editCase() {
      // 1.关闭对话框
      this.dialogFormVisibleEdit = false;
      const res = await this.$http.post(
        `editcase`,
        "id=" +
          this.form.id +
          "&casename=" +
          this.form.casename +
          "&caseinfo=" +
          this.form.caseinfo
      );
      // 2.更新视图
      this.getCaseList();
      // 3.显示提示
      if (res.data.status_code === 201) {
        this.$message.success("修改成功！");
      } else {
        this.$message.info("修改失败！");
      }
    },
    // 编辑案件 - 显示对话框
    showEditCaseDialog(cur_case) {
      // 获取用户数据
      this.form = cur_case;
      this.dialogFormVisibleEdit = true;
    },
    // 删除案件 - 打开消息盒子
    showDeleteCaseMsgBox(caseId) {
      this.$confirm("删除案件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post(`delcase`, "id=" + caseId);
          if (res.data.status_code === 201) {
            this.getCaseList();
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
    // 添加案件 - 发送请求
    async addCase() {
      // 1.关闭对话框
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post(
        "cases",
        "casename=" + this.form.casename + "&caseinfo=" + this.form.caseinfo
      );
      if (res.data.status_code === 201) {
        // 2.提示成功
        this.$message.success(res.data.msg);
        // 3.更新数据
        this.getCaseList();
        // 4.清空文本
        this.form = {};
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 添加案件 - 显示对话框
    showAddCaseDialog() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 搜索案件
    searchCase() {
      this.getCaseList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getCaseList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getCaseList();
    },
    // 获取案件列表的请求
    async getCaseList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `cases?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.caselist = res.data.caselist;
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
