<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>通讯记录</el-breadcrumb-item>
      <el-breadcrumb-item>微信</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 账号筛选 -->
    <el-row>
      <h5>账号筛选</h5>
      <el-input placeholder="请输入发送方关键字" v-model="query.sender" class="inputSearch" clearable>
      </el-input>
      <el-input placeholder="请输入接收方关键字" v-model="query.receiver" class="inputSearch" clearable>
      </el-input>
    </el-row>

    <!-- 时间筛选 -->
    <el-row>
      <h5>时间筛选</h5>
      <el-date-picker v-model="query.time_start" type="date" placeholder="日期（起）" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-date-picker v-model="query.time_end" type="date" placeholder="日期（止）" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-row>

    <!-- 搜索框 -->
    <el-row class="searchRow">
      <h5>内容筛选</h5>
      <el-select v-model="chosen_mt" placeholder="请选择内容类型" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入聊天内容关键字" v-model="query.content" class="inputSearch" clearable>
      </el-input>
      <el-button type="primary" @click="searchWechat()" icon="el-icon-search">检索</el-button>
    </el-row>
    <el-row>
      <el-switch v-model="mask" @change="getWechatList" active-text="屏蔽推送消息">
      </el-switch>
    </el-row>

    <!-- 表格 -->
    <el-table :data="wechatlist" border :row-class-name="tableRowClassName" :default-sort="{prop: 'time', order: 'descending'}" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(200, 200, 200, 0.8)">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column fixed prop="time" label="时间" width="200" sortable>
      </el-table-column>
      <el-table-column prop="sender" label="发送方" width="300">
      </el-table-column>
      <el-table-column prop="receiver" label="接收方" width="300">
      </el-table-column>
      <el-table-column prop="msgType" label="类型" width="100">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="400" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="phone_name" label="手机名称" width="300">
      </el-table-column>
      <el-table-column prop="phone_number" label="手机号码" width="200">
      </el-table-column>
      <el-table-column fixed prop="op" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" plain type="success" icon="el-icon-document" circle @click="showWechatInfoDialog(scope.row)"></el-button>
          <el-button size="mini" :disabled="scope.row.msgType!='图片' && scope.row.msgType!='音频' && scope.row.msgType!='视频'" plain type="primary" icon="el-icon-video-play" circle @click="openPlayer(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 聊天内容详情对话框 -->
    <el-dialog title="聊天记录详情" :visible.sync="dialogFormVisibleInfo">
      <el-card class="card-bg" style="background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);">
        <el-card style="margin-bottom: 10px; height: 100px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>时间：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.time}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px; height: 160px;" shadow="hover">
          <el-row>
            <el-col :span="8">
              <h4>发送方：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.sender}}</h4>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <h4>接收方：</h4>
            </el-col>
            <el-col :span="16">
              <h4>{{form.receiver}}</h4>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px;" shadow="hover">
          <el-row>
            <h4>内容：</h4>
          </el-row>
          <el-row>
            <div>{{form.content}}</div>
          </el-row>
        </el-card>
      </el-card>
    </el-dialog>
  </el-card>
</template>


<script>
export default {
  data() {
    return {
      // 选择器
      options: [
        {
          value: "文本",
          label: "文本",
        },
        {
          value: "图片",
          label: "图片",
        },
        {
          value: "音频",
          label: "音频",
        },
        {
          value: "视频",
          label: "视频",
        },
      ],
      chosen_mt: "",
      // 屏蔽开关
      mask: false,
      loading: false,
      query: {
        content: "",
        time_start: "",
        time_end: "",
        sender: "",
        receiver: "",
      },
      wechatlist: [],
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      dialogFormVisibleInfo: false,
      // 表单数据
      form: {},
    };
  },
  created() {
    this.getWechatList();
  },
  methods: {
    // 点击打开媒体页面
    openPlayer(row) {
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
    // 列表过滤
    tableRowClassName(row) {
      if (row.row.msgType === "10000") {
        return "warning-row";
      } else if (row.row.sender === "weixin(weixin)") {
        return "ignorable-row";
      } else {
        return "";
      }
    },
    // 查看聊天记录 - 绑定数据，显示对话框
    showWechatInfoDialog(cur_wechat) {
      this.form = cur_wechat;
      this.dialogFormVisibleInfo = true;
    },
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getWechatList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getWechatList();
    },
    // 搜索聊天记录
    searchWechat() {
      this.getWechatList();
    },
    // 获取聊天记录
    async getWechatList() {
      this.loading = true;
      // 需要授权的API，必须在请求头中使用Authorization字段提供token
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(
        `wechats`,
        "content=" +
          this.query.content +
          "&time_start=" +
          this.query.time_start +
          "&time_end=" +
          this.query.time_end +
          "&sender=" +
          this.query.sender +
          "&receiver=" +
          this.query.receiver +
          "&pagenum=" +
          this.pagenum +
          "&pagesize=" +
          this.pagesize +
          "&mask=" +
          this.mask +
          "&msgType=" +
          this.chosen_mt
      );
      this.wechatlist = res.data.wechatlist;
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
/deep/ .el-table .warning-row {
  background: oldlace;
}
/deep/ .el-table .success-row {
  background: #f0f9eb;
}
/* /deep/ .el-table .ignorable-row {
  color: #aaaaaa;
} */
</style>