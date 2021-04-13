<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <el-col>
        <h5>条件筛选（模糊）</h5>
        <el-input placeholder="姓名" v-model="query.name" class="inputSearch" clearable style="width: 150px;">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-select v-model="query.gender" placeholder="性别" style="width: 150px;" clearable>
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-select v-model="query.nation" filterable placeholder="民族" style="width: 150px;" clearable>
        <el-option v-for="item in options_nation" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-cascader size="large" :options="options_native" v-model="query.native" :props="nativeProps" placeholder="籍贯" style="width: 300px;" clearable>
      </el-cascader>
    </el-row>
    <el-row>
      <el-input placeholder="角色" v-model="query.role" class="inputSearch" clearable style="width: 150px;">
      </el-input>
      <el-input placeholder="住址" v-model="query.address" class="inputSearch" clearable style="width: 500px;">
      </el-input>

    </el-row>
    <el-row>
      <h5>出生日期筛选</h5>
      <el-date-picker v-model="query.birth_start" type="date" placeholder="出生日期（起）" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-date-picker v-model="query.birth_end" type="date" placeholder="出生日期（止）" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-row>
    <h5>身份证号码检索（精确）</h5>
    <el-row>
      <el-input placeholder="身份证号码" v-model="query.idf" class="inputSearch" clearable>
      </el-input>
      <el-button type="primary" @click="searchPerson()" icon="el-icon-search">检索</el-button>
    </el-row>
    <el-divider></el-divider>
    <!-- 表格 -->
    <el-button class="add-button" type="success" @click="showAddPersonDialog()">添加人员</el-button>
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
      <el-table-column fixed prop="op" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showPersonInfoDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditPersonDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeletePersonMsgBox(scope.row.id)"></el-button>
          <el-button size="mini" plain type="info" icon="el-icon-mobile-phone" circle @click="showPhonesMsgBox(scope.row)"></el-button>
          <el-button size="mini" plain type="warning" icon="el-icon-paperclip" circle @click="showInCaseMsgBox(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框     -->
    <!-- 添加人员的对话框 -->
    <el-dialog title="添加人员" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="姓名" label-width="100px">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" label-width="100px">
          <el-input v-model="form.idf" autocomplete="off" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="100px">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" label-width="100px">
          <el-date-picker v-model="form.birthday" type="date" placeholder="选择出生日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="民族" label-width="100px">
          <el-select v-model="form.nation" filterable placeholder="请选择民族">
            <el-option v-for="item in options_nation" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" label-width="100px">
          <el-cascader size="large" :options="options_native" v-model="selectedNative">
          </el-cascader>
        </el-form-item>
        <el-form-item label="住址" label-width="100px">
          <el-input v-model="form.address" autocomplete="off" placeholder="请输入住址"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-input v-model="form.role" autocomplete="off" placeholder="请输入角色"></el-input>
        </el-form-item>
        <el-form-item label="其他信息" label-width="100px">
          <el-input v-model="form.more" autocomplete="off" type="textarea" :rows="15" placeholder="文本项：按一定格式输入，以利于查询和统计"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addPerson()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改人员的对话框 -->
    <el-dialog title="修改人员" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="姓名" label-width="100px">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" label-width="100px">
          <el-input v-model="form.idf" autocomplete="off" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="100px">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" label-width="100px">
          <el-date-picker v-model="form.birthday" type="date" placeholder="选择出生日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="民族" label-width="100px">
          <el-select v-model="form.nation" filterable placeholder="请选择">
            <el-option v-for="item in options_nation" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" label-width="100px">
          <el-cascader size="large" :options="options_native" v-model="selectedNative">
          </el-cascader>
          <div style="display: inline;">{{selectedNative[0]}} {{selectedNative[1]}}</div>
        </el-form-item>
        <el-form-item label="住址" label-width="100px">
          <el-input v-model="form.address" autocomplete="off" placeholder="请输入住址"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-input v-model="form.role" autocomplete="off" placeholder="请输入角色"></el-input>
        </el-form-item>
        <el-form-item label="其他信息" label-width="100px">
          <el-input v-model="form.more" autocomplete="off" type="textarea" :rows="15" placeholder="文本项：按一定格式输入，以利于查询和统计"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editPerson()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 人员详情信息的对话框 -->
    <el-dialog title="人员信息" :visible.sync="dialogFormVisibleInfo">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>姓名</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.name}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>性别</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.gender}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>身份证号码</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.idf}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>民族</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.nation}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>籍贯</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.native_province}} {{form.native_city}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>生日</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.birthday}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>住址</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.address}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>角色</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.role}}</h4>
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
    <!-- 人员手机列表的对话框 -->
    <el-dialog title="人员手机" :visible.sync="dialogPhonesOfPerson">
      <!-- 表格 -->
      <el-card>
        <el-table :data="phonelist" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
          <el-table-column fixed prop="id" label="编号" width="100">
          </el-table-column>
          <el-table-column fixed prop="name" label="手机名称" width="300">
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" width="300">
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showAddPhoneDialog()">添加手机</el-button>
      </div>
    </el-dialog>
    <!-- 添加手机的对话框 -->
    <el-dialog title="添加手机" :visible.sync="dialogAddPhone">
      <el-card>
        <el-form :model="phoneform">
          <el-form-item label="手机名称" label-width="80px">
            <el-input v-model="phoneform.name" autocomplete="off" placeholder="请输入手机名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="80px">
            <el-input v-model="phoneform.phone" autocomplete="off" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="80px">
            <el-input v-model="phoneform.more" autocomplete="off" type="textarea" :rows="15"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPhone = false">关 闭</el-button>
        <el-button type="primary" @click="addPhone()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 人员涉及案件对话框 -->
    <el-dialog title="涉及案件" :visible.sync="dialogInCase">
      <el-card>
        <el-checkbox-group v-model="checked_case">
          <el-checkbox-button v-for="option in options_case" :label="option" :key="option">{{option}}</el-checkbox-button>
        </el-checkbox-group>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInCase = false">关 闭</el-button>
        <el-button type="primary" @click="incase()">修 改</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode,
} from "element-china-area-data";

export default {
  data() {
    return {
      loading: false,
      checked_case: [],
      options_case: ["案件一", "案件二", "案件三", "案件四", "案件五"],
      // 民族选择器选项数据
      options_nation: [
        { value: "汉族", label: "汉族" },
        { value: "蒙古族", label: "蒙古族" },
        { value: "回族", label: "回族" },
        { value: "藏族", label: "藏族" },
        { value: "维吾尔族", label: "维吾尔族" },
        { value: "苗族", label: "苗族" },
        { value: "彝族", label: "彝族" },
        { value: "壮族", label: "壮族" },
        { value: "布依族", label: "布依族" },
        { value: "朝鲜族", label: "朝鲜族" },
        { value: "满族", label: "满族" },
        { value: "侗族", label: "侗族" },
        { value: "瑶族", label: "瑶族" },
        { value: "白族", label: "白族" },
        { value: "土家族", label: "土家族" },
        { value: "哈尼族", label: "哈尼族" },
        { value: "哈萨克族", label: "哈萨克族" },
        { value: "傣族", label: "傣族" },
        { value: "黎族", label: "黎族" },
        { value: "傈僳族", label: "傈僳族" },
        { value: "佤族", label: "佤族" },
        { value: "畲族", label: "畲族" },
        { value: "高山族", label: "高山族" },
        { value: "拉祜族", label: "拉祜族" },
        { value: "水族", label: "水族" },
        { value: "东乡族", label: "东乡族" },
        { value: "纳西族", label: "纳西族" },
        { value: "景颇族", label: "景颇族" },
        { value: "柯尔克孜族", label: "柯尔克孜族" },
        { value: "土族", label: "土族" },
        { value: "达斡尔族", label: "达斡尔族" },
        { value: "仫佬族", label: "仫佬族" },
        { value: "羌族", label: "羌族" },
        { value: "布朗族", label: "布朗族" },
        { value: "撒拉族", label: "撒拉族" },
        { value: "毛南族", label: "毛南族" },
        { value: "仡佬族", label: "仡佬族" },
        { value: "锡伯族", label: "锡伯族" },
        { value: "阿昌族", label: "阿昌族" },
        { value: "普米族", label: "普米族" },
        { value: "塔吉克族", label: "塔吉克族" },
        { value: "怒族", label: "怒族" },
        { value: "乌孜别克族", label: "乌孜别克族" },
        { value: "俄罗斯族", label: "俄罗斯族" },
        { value: "鄂温克族", label: "鄂温克族" },
        { value: "德昂族", label: "德昂族" },
        { value: "保安族", label: "保安族" },
        { value: "裕固族", label: "裕固族" },
        { value: "京族", label: "京族" },
        { value: "塔塔尔族", label: "塔塔尔族" },
        { value: "独龙族", label: "独龙族" },
        { value: "鄂伦春族", label: "鄂伦春族" },
        { value: "赫哲族", label: "赫哲族" },
        { value: "门巴族", label: "门巴族" },
        { value: "珞巴族", label: "珞巴族" },
        { value: "基诺族", label: "基诺族" },
      ],
      // 省市选择数据，来源第三方包
      options_native: provinceAndCityDataPlus,
      nativeProps: {},
      // 选择的籍贯（详情页、修改页）
      selectedNative: [],
      query: {
        name: "",
        gender: "",
        nation: "",
        native: [],
        birth_start: "",
        birth_end: "",
        address: "",
        role: "",
        idf: "",
      },
      personlist: [],
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleInfo: false,
      dialogPhonesOfPerson: false,
      dialogAddPhone: false,
      dialogInCase: false,
      // 添加人员的表单数据
      form: {
        id: "",
        name: "",
        gender: "",
        nation: "",
        native_province: "",
        native_city: "",
        birthday: "",
        address: "",
        role: "",
        idf: "",
        more: "",
      },
      phoneform: {
        name: "",
        phone: "",
        more: "",
      },
      phonelist: [],
    };
  },
  created() {
    this.getPersonList();
  },
  methods: {
    // 涉及案件 - 设置人员涉及案件 - 发送请求
    incase() {
      this.$confirm("修改人员涉案信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post(
            `incase`,
            "person_id=" + this.form.id + "&checked_case=" + this.checked_case
          );
          if (res.data.status_code === 201) {
            this.getPersonList();
            this.$message({
              type: "success",
              message: "修改成功！",
            });
          } else {
            this.$message({
              type: "info",
              message: "修改失败！",
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
    // 涉及案件 - 显示对话框 - 渲染案件选项
    async showInCaseMsgBox(cur_person) {
      const res = await this.$http.get(`allcases?person_id=${cur_person.id}`);
      this.options_case = res.data.options_case;
      this.checked_case = res.data.checked_case;

      this.form = cur_person;
      this.dialogInCase = true;
    },
    // 为人员添加手机 - 发送请求
    async addPhone() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `addphone`,
        "person_id=" +
          this.form.id +
          "&name=" +
          this.phoneform.name +
          "&phone=" +
          this.phoneform.phone +
          "&more=" +
          this.phoneform.more
      );
      if (res.data.status_code === 201) {
        this.$message.success(res.data.msg);
        this.phoneform = {};
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 为人员添加手机 - 显示对话框
    showAddPhoneDialog() {
      this.dialogAddPhone = true;
    },
    // 查看人员手机 - 获取手机列表
    async getPhonesOfPerson(person_id) {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `phonesofperson`,
        "person_id=" + person_id
      );
      this.phonelist = res.data.phonelist;
    },
    // 查看人员手机 - 显示对话框
    showPhonesMsgBox(cur_person) {
      this.form = cur_person;
      this.getPhonesOfPerson(cur_person.id);
      this.dialogPhonesOfPerson = true;
    },
    // 查看人员详情 - 绑定数据，显示对话框
    showPersonInfoDialog(cur_person) {
      this.form = cur_person;
      this.selectedNative[0] = cur_person.native_province;
      this.selectedNative[1] = cur_person.native_city;
      this.dialogFormVisibleInfo = true;
    },
    // 编辑人员 - 发送请求
    async editPerson() {
      // 1.关闭对话框
      this.dialogFormVisibleEdit = false;
      var province = CodeToText[this.selectedNative[0]];
      var city = CodeToText[this.selectedNative[1]];
      if (province === "全部" || province === undefined) {
        province = "";
      }
      if (city === "全部" || city === undefined) {
        city = "";
      }
      const res = await this.$http.post(
        `editperson`,
        "id=" +
          this.form.id +
          "&name=" +
          this.form.name +
          "&gender=" +
          this.form.gender +
          "&nation=" +
          this.form.nation +
          "&native_province=" +
          province +
          "&native_city=" +
          city +
          "&birthday=" +
          this.form.birthday +
          "&address=" +
          this.form.address +
          "&role=" +
          this.form.role +
          "&idf=" +
          this.form.idf +
          "&more=" +
          this.form.more
      );
      // 2.更新视图
      this.getPersonList();
      // 3.显示提示
      if (res.data.status_code === 201) {
        this.$message.success("修改成功！");
      } else {
        this.$message.info("修改失败！");
      }
      this.form = {};
      this.selectedNative = [];
    },
    // 编辑案件 - 显示对话框
    showEditPersonDialog(cur_person) {
      // 获取用户数据
      this.form = cur_person;
      this.selectedNative[0] = cur_person.native_province;
      this.selectedNative[1] = cur_person.native_city;
      this.dialogFormVisibleEdit = true;
    },
    // 删除人员 - 打开消息盒子
    showDeletePersonMsgBox(personId) {
      this.$confirm("删除人员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.post(`delperson`, "id=" + personId);
          if (res.data.status_code === 201) {
            this.getPersonList();
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
    // 添加人员 - 发送请求
    async addPerson() {
      // 1.关闭对话框
      this.dialogFormVisibleAdd = false;
      var province = CodeToText[this.selectedNative[0]];
      var city = CodeToText[this.selectedNative[1]];
      if (province === "全部" || province === undefined) {
        province = "";
      }
      if (city === "全部" || city === undefined) {
        city = "";
      }
      const res = await this.$http.post(
        `addperson`,
        "name=" +
          this.form.name +
          "&gender=" +
          this.form.gender +
          "&nation=" +
          this.form.nation +
          "&native_province=" +
          province +
          "&native_city=" +
          city +
          "&birthday=" +
          this.form.birthday +
          "&address=" +
          this.form.address +
          "&role=" +
          this.form.role +
          "&idf=" +
          this.form.idf +
          "&more=" +
          this.form.more
      );
      if (res.data.status_code === 201) {
        // 2.提示成功
        this.$message.success(res.data.msg);
        // 3.更新数据
        this.getPersonList();
        // 4.清空文本
        this.form = {};
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 添加人员 - 显示对话框
    showAddPersonDialog() {
      this.form = {};
      this.selectedNative = [];
      this.dialogFormVisibleAdd = true;
    },
    // 搜索人员
    searchPerson() {
      this.getPersonList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getPersonList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getPersonList();
    },
    // 获取人员列表的请求
    async getPersonList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      var province = CodeToText[this.query.native[0]];
      var city = CodeToText[this.query.native[1]];
      if (province === "全部" || province === undefined) {
        province = "";
      }
      if (city === "全部" || city === undefined) {
        city = "";
      }
      const res = await this.$http.post(
        `persons`,
        "name=" +
          this.query.name +
          "&gender=" +
          this.query.gender +
          "&nation=" +
          this.query.nation +
          "&native_province=" +
          province +
          "&native_city=" +
          city +
          "&birth_start=" +
          this.query.birth_start +
          "&birth_end=" +
          this.query.birth_end +
          "&address=" +
          this.query.address +
          "&role=" +
          this.query.role +
          "&idf=" +
          this.query.idf +
          "&pagenum=" +
          this.pagenum +
          "&pagesize=" +
          this.pagesize
      );
      this.personlist = res.data.personlist;
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




