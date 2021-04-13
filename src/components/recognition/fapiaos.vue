<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>识别结果</el-breadcrumb-item>
      <el-breadcrumb-item>发票</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 账号筛选 -->
    <el-row>
      <h5>通讯账号筛选</h5>
      <el-input placeholder="请输入发送方关键字" v-model="query.sender" class="inputSearch" clearable>
      </el-input>
      <el-input placeholder="请输入接收方关键字" v-model="query.receiver" class="inputSearch" clearable>
      </el-input>
    </el-row>

    <!-- 时间筛选 -->
    <el-row>
      <h5>开票日期筛选</h5>
      <el-date-picker v-model="query.date_start" type="date" placeholder="开票日期（起）" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-date-picker v-model="query.date_end" type="date" placeholder="开票日期（止）" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-row>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <h5>检索</h5>
      <el-col :span="24">
        <el-input placeholder="请输入发票号码" v-model="query.number" class="inputSearch" clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-input placeholder="请输入购买方名称关键字" v-model="query.buyer" class="inputSearch" clearable>
      </el-input>
      <el-input placeholder="请输入销货单位名称关键字" v-model="query.seller_organization" class="inputSearch" clearable>
      </el-input>
      <el-button type="primary" @click="searchFapiao()" icon="el-icon-search">检索</el-button>
    </el-row>


    <h5>价税合计（总）: {{total_price_tax}}</h5>

    <!-- 表格 -->
    <el-table :data="fapiaolist" border :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="number" label="发票号码" width="120">
      </el-table-column>
      <el-table-column prop="date" label="开票日期" width="120" sortable>
      </el-table-column>
      <el-table-column prop="buyer" label="购买方名称" width="200">
      </el-table-column>
      <el-table-column prop="seller_organization" label="销货单位名称" width="300">
      </el-table-column>
      <el-table-column prop="price_tax_low" label="价税合计" width="200">
      </el-table-column>
      <el-table-column prop="sender" label="消息发送方" width="400">
      </el-table-column>
      <el-table-column prop="receiver" label="消息接收方" width="200">
      </el-table-column>
      <el-table-column fixed prop="op" label="操作" width="140">
        <template slot-scope="scope">
          <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showFapiaoInfoDialog(scope.row)"></el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-video-play" circle @click="openPlayer(scope.row)"></el-button>
          <el-button size="mini" plain type="info" icon="el-icon-chat-dot-round" circle @click="showContextDialog(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 发票识别结果详情对话框 -->
    <el-dialog title="发票详情" :visible.sync="dialogFormVisibleInfo">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>发票代码：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.code}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>发票号码：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.number}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>开票日期：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.date}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>购买方名称：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.buyer}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>购买方身份证号码：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.buyer_id}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>价税合计(小写)：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.price_tax_low}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>增值税税额：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.tax}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>销货单位名称：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.seller_organization}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>销售方地址：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.seller_address}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>销售方账号：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.seller_account}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>销售方电话：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.seller_phone}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 80px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>销售方纳税人识别号：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.seller_taxer_id}}</h4>
            </el-col>
          </el-row>
        </el-card>

      </el-card>
    </el-dialog>

    <!-- 查看上下文对话框 -->
    <el-dialog title="聊天记录上下文" :visible.sync="dialogContextVisible" customClass="customWidth">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card class="context_card">
          <el-table :data="contextlist" border :row-class-name="tableRowClassName" style="width: 100%" v-loading="c_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
            <el-table-column fixed prop="time" label="时间" width="180" sortable>
            </el-table-column>
            <el-table-column prop="msgType" label="类型" width="70">
            </el-table-column>
            <el-table-column prop="content" label="内容" width="300" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="sender" label="发送方" width="300">
            </el-table-column>
            <el-table-column prop="receiver" label="接收方" width="300">
            </el-table-column>
            <el-table-column fixed prop="op" label="操作" width="50">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.row.msgType!='图片' && scope.row.msgType!='音频' && scope.row.msgType!='视频'" plain type="primary" icon="el-icon-video-play" circle @click="openWechatPlayer(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>
    </el-dialog>

  </el-card>
</template>


<script>
export default {
  data() {
    return {
      loading: false,
      c_loading: false,
      // 请求条件
      query: {
        number: "",
        date_start: "",
        date_end: "",
        sender: "",
        receiver: "",
        buyer: "",
        seller_organization: "",
      },
      // 发票列表
      fapiaolist: [],
      total_price_tax: 0,
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      dialogFormVisibleInfo: false,
      dialogContextVisible: false,
      // 表单数据
      form: {},
      // 上下文数据
      contextlist: []
    };
  },
  created() {
    this.getFapiaoList();
  },
  methods: {
    // 列表过滤
    tableRowClassName(row) {
      if (row.row.color === "red") {
        return "marking-row";
      } else {
        return "";
      }
    },
    // 获取含有发票信息的聊天记录上下文数据
    async getContextList(cur_id) {
      this.c_loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `contexts`,
        "id=" + cur_id
      );
      this.status_code = res.data.status_code;
      if (res.data.status_code == '201') {
        this.$notify({
          title: '提示',
          message: 'NO MATCHING',
          duration: 3000
        });
      } else {
        this.contextlist = res.data.contextlist;
      }
      this.c_loading = false;
    },
    // 打开上下文对话框
    showContextDialog(cur_id) {
      this.contextlist = [];
      this.getContextList(cur_id);
      this.dialogContextVisible = true;
    },
    // 点击打开聊天记录上下文媒体文件
    openWechatPlayer(row) {
      if (row.msgType === "图片") {
        // to pic
        let routeUrl = "http://127.0.0.1:5000/picture?respath=" + row.resPath;
        window.open(routeUrl, "_blank");
      } else if (row.msgType === "音频") {
        // to audio
        let routeUrl = "http://127.0.0.1:5000/audio?respath=" + row.resPath;
        window.open(routeUrl, "_blank");
      } else if (row.msgType === "视频") {
        // to video
        let routeUrl = "http://127.0.0.1:5000/video?respath=" + row.resPath;
        window.open(routeUrl, "_blank");
      } else {
        this.$notify({
          title: "提示！",
          message: "非媒体文件。",
          type: "warning",
          duration: 3000,
        });
      }
    },
    // 点击打开媒体页面
    openPlayer(row) {
      if (row.path) {
        // to pic
        let routeUrl =
          "http://127.0.0.1:5000/picture?respath=..\\static\\wechat\\collection\\" +
          row.path;
        window.open(routeUrl, "_blank");
      } else {
        this.$notify({
          title: "提示！",
          message: "非媒体文件。",
          type: "warning",
          duration: 3000,
        });
      }
    },
    // 查看聊天记录 - 绑定数据，显示对话框
    showFapiaoInfoDialog(cur_fapiao) {
      this.form = cur_fapiao;
      this.dialogFormVisibleInfo = true;
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getFapiaoList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getFapiaoList();
    },
    // 搜索聊天记录
    searchFapiao() {
      this.pagenum = 1;
      this.getFapiaoList();
    },
    // 获取聊天记录
    async getFapiaoList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `fapiaos`,
        "number=" +
          this.query.number +
          "&date_start=" +
          this.query.date_start +
          "&date_end=" +
          this.query.date_end +
          "&sender=" +
          this.query.sender +
          "&receiver=" +
          this.query.receiver +
          "&buyer=" +
          this.query.buyer +
          "&seller_organization=" +
          this.query.seller_organization +
          "&pagenum=" +
          this.pagenum +
          "&pagesize=" +
          this.pagesize
      );
      this.fapiaolist = res.data.fapiaolist;
      this.total = res.data.total_count;
      this.total_price_tax = res.data.total_price_tax;
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
/deep/ .el-table .marking-row {
  background: rgb(255, 216, 216);
}
/* /deep/ .el-table .ignorable-row {
  color: #aaaaaa;
} */
/deep/ .customWidth{
    width:70%;
}
</style>