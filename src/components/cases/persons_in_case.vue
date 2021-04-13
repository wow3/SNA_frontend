<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>案件管理</el-breadcrumb-item>
      <el-breadcrumb-item>涉案人员</el-breadcrumb-item>
      <el-breadcrumb-item>案件名称：{{caseform.casename}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>
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
            <el-button size="mini" plain type="primary" icon="el-icon-mobile-phone" circle @click="showPersonPhone(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->

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

  </el-card>
</template>

<script>
import { globalBus } from "../../bus/globalBus.js";

export default {
  data() {
    return {
      loading: false,
      // 人员列表
      personlist: [
        {
          id: 1,
          name: "熊凯",
          gender: "男",
          nation: "圣多美和普林西比",
          idf: "620623195903151105",
          native_province: "辽宁省",
          native_city: "平县",
          birthday: "1993-11-05",
          address: "宁夏回族自治区飞市海港阮街h座 746620",
          role: "P6",
          more:
            "都是经验发表一个生活.开始网络当前能够一定女人.\n任何只是日本人员.国际地方到了已经然后正在.成功这是日期可是.\n方面不断品牌.我的情况主题次数功能论坛不是.我们已经这些汽车出来北京.\n中文情况如何服务中国.有限喜欢日本一种由于.\n基本大家项目希望政府.\n作品以下记者今天.行业喜欢有关网络方法.由于发现客户准备虽然政府计划这么.\n时候留言合作历史公司.以后程序相关自己.",
        },
        {
          id: 2,
          name: "杨晨",
          gender: "女",
          nation: "乌克兰",
          idf: "350401198810281321",
          native_province: "新疆维吾尔自治区",
          native_city: "武汉县",
          birthday: "2009-03-23",
          address: "香港特别行政区柳州市沈河兰州路i座 747172",
          role: "P1",
          more:
            "怎么你们选择能力销售只有有限公司.联系发表来源说明说明内容美国.技术文化生活都是产品不要游戏.有些一点最大国内实现同时地区.\n查看法律客户自己.之间经济广告建设.\n分析北京文件.本站可是表示成功历史必须方面一个.各种网站成功历史.\n登录汽车非常包括电脑喜欢.孩子主要免费分析.所有朋友其中设备经济标准.继续精华直接.\n一切资源能够但是东西.完全作为可以虽然.世界这样直接提高这样.",
        },
        {
          id: 3,
          name: "张兵",
          gender: "女",
          nation: "缅甸",
          idf: "140500193405191135",
          native_province: "甘肃省",
          native_city: "兴安盟县",
          birthday: "1990-11-22",
          address: "青海省辽阳市六枝特祁街x座 101370",
          role: "P5",
          more:
            "自己生活免费得到发展方面特别事情.数据或者文件系列.\n音乐孩子有限不能.事情联系一定处理.最后地区中国欢迎可是只要学习.\n操作大家得到控制内容.主题内容一定方面.东西分析状态目前.\n主要一点社会记者比较地区.历史为什朋友开发起来.帖子状态她的增加设备不要过程.\n部分北京情况看到.大小电话系列不过来自都是.\n人民工作觉得音乐能力这是其他.当前她的广告的话.",
        },
        {
          id: 4,
          name: "冯秀珍",
          gender: "女",
          nation: "纽埃岛",
          idf: "511304200002202394",
          native_province: "海南省",
          native_city: "军市",
          birthday: "1982-01-17",
          address: "山西省宜都市沈北新海口街N座 455829",
          role: "P3",
          more:
            "作者组织完全大学帖子.\n实现深圳支持不是密码.这么所以登录系列一次.实现的人正在通过出来觉得.\n人民所有中文简介参加.专业由于如此全部责任程序这么标题.直接女人计划程序.到了深圳所以一切.\n点击汽车有些出来语言没有的人.都是功能一样选择研究.直接评论时候新闻最新.\n没有积分网络所有发现是否.一直电影标题有些发表大学内容.重要发布电影他的精华重要有些.",
        },
        {
          id: 5,
          name: "任斌",
          gender: "女",
          nation: "刚果",
          idf: "420115198212286069",
          native_province: "新疆维吾尔自治区",
          native_city: "慧市",
          birthday: "1986-05-24",
          address: "山东省汕尾市平山孙街C座 935888",
          role: "P4",
          more:
            "具有使用通过点击还是不会根据.等级基本位置中心教育应该决定以下.可是搜索方式正在根据.\n数据组织阅读.由于以下然后次数是一.还有你的认为你们音乐一样.\n发展然后密码大学.具有组织现在专业影响的人设计朋友.准备事情决定业务工具历史详细.\n正在有些谢谢音乐.\n但是或者之后过程的是系列.系统我们日期手机如果.\n手机用户发布回复.以及得到人民是否.",
        },
        {
          id: 6,
          name: "陆桂芝",
          gender: "男",
          nation: "不丹",
          idf: "411524198509269048",
          native_province: "河北省",
          native_city: "想市",
          birthday: "2007-11-25",
          address: "海南省拉萨市大东覃路C座 882735",
          role: "P6",
          more:
            "网络出现对于日本日期.很多简介实现首页浏览无法今年.\n基本类别有关得到关于然后来源完成.中文可以地址起来服务成功.为了内容规定程序不同计划.\n操作功能中文国家一次对于男人.决定功能一下一次一下那些地区.\n支持已经计划电话如何怎么服务.组织来源以后开始这里手机过程企业.\n语言这个安全如此不要一些看到.完全你的两个这是来源参加完成.",
        },
        {
          id: 7,
          name: "孙勇",
          gender: "男",
          nation: "新西兰",
          idf: "653022198109166978",
          native_province: "青海省",
          native_city: "璐市",
          birthday: "1974-12-01",
          address: "西藏自治区长春县翔安大冶路l座 765514",
          role: "P1",
          more:
            "这种名称信息一定.\n得到回复中文密码如何不要不能.新闻历史产品这是作者全部.\n最新全部作者孩子.项目网上评论自己.一个情况地区生活.\n自己制作一直类型方法很多还有不过.\n质量浏览您的怎么工作工作可能.信息中心如此.\n系统今年游戏等级数据特别品牌.因此有限经营什么网上对于以上.登录一般单位如此.\n显示任何工程全国人员公司.可能的是都是不是人民地区谢谢.成功系统电话也是简介来自教育当前.",
        },
        {
          id: 8,
          name: "万想",
          gender: "女",
          nation: "吉尔吉斯斯坦",
          idf: "130900195207073591",
          native_province: "安徽省",
          native_city: "重庆市",
          birthday: "1987-08-19",
          address: "广西壮族自治区利县永川彭街Y座 215452",
          role: "P6",
          more:
            "根据资料当前地区美国.资料设备产品如此.\n大学最新日本完全有关以后评论.\n设备网上状态语言虽然操作.进入电话一般.国内社会大小方面支持为了名称.\n学生那个只有其实报告.也是要求商品记者说明他们.位置作为已经一切包括.\n一样日期搜索密码技术作者系列.教育作者生产作为深圳业务.活动使用认为有限的话地址回复.\n完全完成男人语言.直接最新文件.如何空间还有日本.\n上海威望大学特别过程.中国朋友他们起来.",
        },
        {
          id: 9,
          name: "陆强",
          gender: "男",
          nation: "西班牙",
          idf: "451026193701120294",
          native_province: "黑龙江省",
          native_city: "莹县",
          birthday: "2006-05-08",
          address: "浙江省呼和浩特市城东郑街C座 544511",
          role: "P2",
          more:
            "回复投资浏览.就是有关如何标题因为.部分设计这么帮助全国只要.这种新闻是否.\n作为浏览的是你们作为.网站准备关于不会这些作为如果.\n欢迎北京品牌用户主题学校.能够最大下载研究不会男人支持.比较进行人民深圳重要过程.\n特别的是已经.\n北京本站这里.首页有些工作出来详细.电影操作历史中国.\n对于次数功能认为.而且计划业务然后新闻中国.你们积分应用登录会员还是品牌.",
        },
        {
          id: 10,
          name: "符帅",
          gender: "女",
          nation: "几内亚比绍",
          idf: "350881195212116860",
          native_province: "甘肃省",
          native_city: "宁德县",
          birthday: "2012-09-21",
          address: "福建省波县城北邯郸路g座 354456",
          role: "P4",
          more:
            "精华女人登录.历史当然同时表示看到.\n责任软件具有应用销售工具.他的您的游戏其他朋友状态状态.部门只是拥有时候加入的人.\n基本还有提供威望需要.法律如此管理增加作为的人不要可以.\n位置时候主题在线或者教育名称.数据不断推荐.\n论坛大学内容相关系统方面出现.生产比较注意客户.\n使用认为报告提高开始销售软件.我们项目作品客户时候包括.资料国家任何基本生产.",
        },
        {
          id: 11,
          name: "徐淑兰",
          gender: "男",
          nation: "索马里",
          idf: "230811195810227150",
          native_province: "安徽省",
          native_city: "建华市",
          birthday: "1998-06-27",
          address: "福建省欣县蓟州唐路F座 891929",
          role: "P6",
          more:
            "不断男人应用.出来东西评论使用实现.生活等级状态数据之后点击功能.\n起来大小一般或者.完全发现一起起来已经企业.标准科技搜索业务留言一点来源教育.\n社会自己文化.状态不要登录朋友.进行活动必须活动问题目前投资成为.\n部分我的我们地方那些.分析不同孩子中文还有喜欢而且.欢迎不同增加一次.\n技术是否商品中心不同.人员类别单位.\n喜欢管理两个.公司最大帮助谢谢然后.不要电子完成报告以上而且.",
        },
        {
          id: 12,
          name: "王峰",
          gender: "男",
          nation: "黎巴嫩",
          idf: "411726197105150963",
          native_province: "贵州省",
          native_city: "健县",
          birthday: "1973-10-08",
          address: "江苏省东县淄川宁德路T座 805631",
          role: "P6",
          more:
            "重要生产人民投资你的深圳.环境这样上海不同.\n解决设备发表.本站查看基本帖子方法自己会员解决.大家是一市场但是自己同时积分.\n次数产品那个还是基本登录.分析虽然操作.\n部门为了学校经验程序.包括孩子拥有时间.然后政府那么以及根据事情提供.\n如此公司会员.日期不断下载文化.可能推荐虽然特别语言决定.\n这种事情因为工具商品地方.计划基本这个方式.东西全部标准表示来源工作.图片继续大学这些.",
        },
        {
          id: 13,
          name: "刘兰英",
          gender: "女",
          nation: "肯尼亚",
          idf: "330482196606249100",
          native_province: "天津市",
          native_city: "畅县",
          birthday: "1981-03-29",
          address: "广西壮族自治区嘉禾市魏都张街q座 439880",
          role: "P3",
          more:
            "之间世界教育全国一下.不要表示公司作者问题其实音乐.继续最大开始觉得各种.\n手机比较全国还是本站.成功不能制作.生活准备发生出来大家怎么.\n处理如果到了运行朋友只有系列.社区这里研究系统事情信息选择.关于学生规定一次语言文件.\n商品客户如此已经你的提供.市场制作直接.\n论坛看到您的这些科技留言时间.功能来自作为简介影响.教育报告主要密码支持国内.",
        },
        {
          id: 14,
          name: "孔兰英",
          gender: "男",
          nation: "法属波里尼西亚",
          idf: "430811198502106817",
          native_province: "辽宁省",
          native_city: "春梅市",
          birthday: "1997-11-22",
          address: "新疆维吾尔自治区杭州市蓟州吴路u座 271651",
          role: "P4",
          more:
            "制作看到产品没有全部语言搜索.国际因为状态商品公司女人决定.\n历史他们简介上海参加用户为什.如此人员知道进入出现.\n社会东西您的.信息为了就是发现.\n比较世界你的直接建设出现包括.完全实现可是如何.但是正在日期设备.\n状态可以威望重要使用方面.拥有网站功能免费简介企业.\n之后女人分析.欢迎同时业务还是系列网站市场.\n以及回复文化联系.企业认为其他一切专业.",
        },
        {
          id: 15,
          name: "杨伟",
          gender: "女",
          nation: "智利",
          idf: "210727193505244942",
          native_province: "广西壮族自治区",
          native_city: "长春市",
          birthday: "1981-06-05",
          address: "陕西省荣县崇文杨路S座 823696",
          role: "P1",
          more:
            "文化任何的是任何正在首页一点.语言谢谢活动的是.人民信息然后任何准备所有商品.\n东西文章更多一样.经营也是他的建设支持.次数软件文化计划国家.生产不是或者评论.\n由于用户应用由于.运行社区如此必须客户部门公司.项目企业客户如何浏览最后数据.\n一定但是最后其他以下进行.应该应该他的设计因为所以人员.",
        },
        {
          id: 16,
          name: "罗军",
          gender: "男",
          nation: "贝宁",
          idf: "371328196305291027",
          native_province: "安徽省",
          native_city: "玉梅市",
          birthday: "2013-12-21",
          address: "湖北省西宁县新城齐齐哈尔路b座 121686",
          role: "P1",
          more:
            "如果不要搜索责任功能推荐.\n时候品牌方面重要.今年解决销售发生.\n那么人员没有对于.欢迎计划进行问题.以上你们语言状态.认为发布电话发展.\n数据我的状态作为.完成网上分析建设产品.怎么人民感觉等级.电话实现决定日期.\n您的深圳进行会员.功能喜欢各种电话不会计划今天.\n组织虽然一样觉得深圳地址图片.关系标题这个音乐项目还是其他.\n生产教育任何要求.男人他们的话开发.",
        },
        {
          id: 17,
          name: "屠宇",
          gender: "女",
          nation: "马其顿",
          idf: "440308198511265744",
          native_province: "青海省",
          native_city: "丽丽县",
          birthday: "2014-10-30",
          address: "海南省建军市淄川拉萨街o座 671618",
          role: "P6",
          more:
            "非常空间一起那么经济内容还有.北京的话作品有限这么自己其实.图片认为计划当前程序.\n系列继续喜欢需要中心当前应该.女人只要公司注意如何回复.看到发布要求根据制作不同.\n地区有关详细目前继续管理.以上空间拥有说明学校下载发现设计.历史解决这些广告来源要求工具内容.\n系列网络数据感觉大学.一切为什是一.\n人民推荐成功名称无法.分析可是主要关系.\n经济系统直接等级程序自己.",
        },
        {
          id: 18,
          name: "唐雷",
          gender: "女",
          nation: "比利时",
          idf: "120111193701319854",
          native_province: "四川省",
          native_city: "石家庄市",
          birthday: "1983-03-19",
          address: "陕西省嘉禾县璧山哈尔滨路r座 953713",
          role: "P1",
          more:
            "历史积分教育工程点击.中文我的作品参加他们.\n产品只有提供地址.男人其他为了能够.大小制作这里.\n分析日本知道一种国家.更新能够价格论坛有限中心.\n孩子不能计划在线服务电子.电子公司如果知道今天销售拥有数据.\n情况社区也是不会记者世界要求.网上的话这些投资地方.人民日本管理工程显示那个参加.\n影响我们工程大学环境日本.中文来自比较没有原因操作.登录电影图片组织.",
        },
        {
          id: 19,
          name: "李丽华",
          gender: "男",
          nation: "阿塞拜疆",
          idf: "51180319910116216X",
          native_province: "江西省",
          native_city: "平市",
          birthday: "2009-07-20",
          address: "浙江省想市友好张家港路i座 995820",
          role: "P7",
          more:
            "免费在线所以.全国汽车成功其中.\n朋友信息文章那么.\n工作公司项目学习不是商品为什拥有.基本其中控制作品电话.\n规定因此作品一定.注册因此类别留言产品国家发现来自.作为其实具有不是.的话分析在线商品有关所以.\n图片生产有关非常注意不断具有.非常点击管理等级建设开发.还是感觉个人或者设计她的大小.\n地方一次经营只有新闻包括.部分设计文化还有个人.规定那些记者学生学校信息.",
        },
        {
          id: 20,
          name: "刘春梅",
          gender: "男",
          nation: "埃塞俄比亚",
          idf: "410822195911028065",
          native_province: "湖南省",
          native_city: "浩市",
          birthday: "1978-12-15",
          address: "重庆市柳市白云邓街z座 851533",
          role: "P2",
          more:
            "部分客户一起.\n参加需要情况.电脑登录用户.\n表示能力比较工程.为了不会市场的人.\n所有然后手机设计规定.什么品牌中心一种也是.这么下载全国但是.\n一切联系电脑所以什么直接.通过出现你们那些提供系列要求.\n看到他们信息语言.成功一起两个设备发表.\n生产因为上海开始一切.行业国际系统出现因此.目前美国如何可是功能新闻浏览.\n日本经济企业显示汽车.查看发展在线包括类型.",
        },
      ],
      // 分页相关数据
      pagenum: 1,
      pagesize: 10,
      total: -1,
      // 对话框的属性
      dialogFormVisibleInfo: false,
      // 人员表单
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
      caseform: {
        id: "1",
        casename: "测试案件",
        caseinfo: "测试",
      },
    };
  },

  created() {
    globalBus.$on("case_id", async (case_id) => {
      console.log(`this one: ${case_id}`);
      this.caseform.id = case_id;
      console.log('in here: cid=' + this.caseform.id);
    });
    this.getPersonList();
  },

  methods: {
    // 获取涉案人员数据
    async getPersonList() {
      this.loading = true;
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      console.log("cid=" + this.caseform.id);
      const res = await this.$http.post(`personsincase`, "caseid=" + this.caseform.id);
      this.personlist = res.data.personlist;
      this.caseform.casename = res.data.this_case.casename;
      this.caseform.caseinfo = res.data.this_case.caseinfo;
      this.loading = false;
    },
    // 查看人员详情 - 绑定数据，显示对话框
    showPersonInfoDialog(cur_person) {
      this.form = cur_person;
      this.dialogFormVisibleInfo = true;
    },
  },
};
</script>

<style scoped>
</style>
