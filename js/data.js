// 地球Online 评分测试 — 数据层

const QUESTIONS = [
  { id:1, module:'身份确认', cmdLog:'> 正在扫描 [玩家身份模块] …', question:'如果有人把你的前半生写进地球Online游戏评测，你觉得开头应该是？', options:[
    { text:'「开服45亿年，这位玩家居然还没退游」', achievements:['强制在线'] },
    { text:'「随机开局，属性点分配存疑」', achievements:['强制在线'] },
    { text:'「UID已激活，主线任务加载中……」', achievements:[] },
    { text:'「警告：此账号有严重挂机嫌疑」', achievements:['退游按钮不存在'] }
  ]},
  { id:2, module:'身份确认', cmdLog:'> 正在扫描 [服务器归属] …', question:'你觉得自己被分配到了哪个服务器？', options:[
    { text:'国服·困难模式 — 人多竞争大，但爆率还行', achievements:[] },
    { text:'欧服·休闲服 — 躺着都能升级', achievements:[] },
    { text:'国服·地狱服 — 出生点资源匮乏，全靠肝', achievements:['金币获取困难'] },
    { text:'混服 — 我也不知道自己在哪，反正延迟很高', achievements:[] }
  ]},
  { id:3, module:'身份确认', cmdLog:'> 正在扫描 [初始属性] …', question:'你的「初始属性点」分配最接近哪种？', options:[
    { text:'智力+运气双高 — 老天爷喂饭型', achievements:[] },
    { text:'颜值+社交拉满 — 靠脸/靠嘴吃饭型', achievements:[] },
    { text:'耐力+韧性点满 — 打不死的小强型', achievements:['自律传说'] },
    { text:'好像都点了，又好像都没点 — 均衡平庸型', achievements:['空想行动派'] }
  ]},
  { id:4, module:'身份确认', cmdLog:'> 正在扫描 [角色满意度] …', question:'如果有人告诉你「可以重新捏脸+选出生地」，你会？', options:[
    { text:'立刻重开！我有一堆想改的设定', achievements:['捏脸系统崩坏'] },
    { text:'算了，现在的存档虽然烂但也习惯了', achievements:['退游按钮不存在'] },
    { text:'我只想改经济属性，别的无所谓', achievements:[] },
    { text:'不换——这条命我认了，玩到底', achievements:[] }
  ]},
  { id:5, module:'日常生存', cmdLog:'> 正在扫描 [日常任务模块] …', question:'你的日常通勤/上学路径，用游戏术语最准确的是？', options:[
    { text:'每日跑图 — 固定路线，固定时间，和NPC没区别', achievements:['NPC觉醒'] },
    { text:'地铁/公交是我的第二卧室 — 上车就睡，到站自动醒', achievements:['通勤耐力MAX'] },
    { text:'堵车让我怀疑道路AI的路径规划算法是不是坏了', achievements:['通勤耐力MAX'] },
    { text:'远程办公/走路上学 — 我跳过了这个副本', achievements:[] }
  ]},
  { id:6, module:'日常生存', cmdLog:'> 正在扫描 [饮食模块] …', question:'上周你的伙食来源，占比最大的是？', options:[
    { text:'外卖App — 我和骑手的亲密度已达「家人」级', achievements:['外卖至尊VIP'] },
    { text:'食堂/公司楼下 — 每天三顿同一家，老板认得我', achievements:[] },
    { text:'自己做 — 起码我会煮泡面加蛋，算吗？', achievements:[] },
    { text:'饭搭子/对象/室友投喂 — 我是被动生存型', achievements:[] }
  ]},
  { id:7, module:'日常生存', cmdLog:'> 正在扫描 [睡眠模块] …', question:'你平均几点入睡？', options:[
    { text:'22:00前 — 我是那种「到点就困」的稀有生物', achievements:['自律传说'] },
    { text:'23:00-1:00 — 正常人类的波动范围', achievements:[] },
    { text:'1:00-3:00 — 服务器维护时段我仍在活跃', achievements:['凌晨三点常驻者'] },
    { text:'3:00以后 — 我和太阳的作息达成了完美错峰', achievements:['凌晨三点常驻者'] }
  ]},
  { id:8, module:'日常生存', cmdLog:'> 正在扫描 [执行力模块] …', question:'你的收藏夹/待办清单/购物车，现状是？', options:[
    { text:'收藏夹=我的数字坟墓 — 存了300条，看过3条', achievements:['空想行动派'] },
    { text:'待办清单比人生规划还长 — 但执行力约等于零', achievements:['空想行动派'] },
    { text:'我是那种「想到就做」的人 — 虽然做一半就换下一个', achievements:[] },
    { text:'我定期清理，已完成>>未完成 — 别羡慕，我有强迫症', achievements:[] }
  ]},
  { id:9, module:'经济扫描', cmdLog:'> 正在扫描 [经济模块·收入] …', question:'你目前的收入来源最接近？', options:[
    { text:'完全靠自己 — 工资/自由职业/创业，不拿家里一分钱', achievements:['经济断奶'] },
    { text:'半靠自己+半靠家里 — 过渡期，新手村补给还没断', achievements:[] },
    { text:'主要还是靠家里 — 新手村的免费补给包还在领', achievements:[] },
    { text:'靠利息/被动收入活着 — 你点这个选项是来炫耀的吧？', achievements:['经济断奶'] }
  ]},
  { id:10, module:'经济扫描', cmdLog:'> 正在扫描 [经济模块·账单] …', question:'你和上个月的花呗/信用卡账单的关系是？', options:[
    { text:'全额还清，甚至觉得花呗给我额度太低', achievements:[] },
    { text:'刚好还完，余额回到三位数', achievements:[] },
    { text:'分期了——「下个月的我一定有钱」', achievements:['金币获取困难'] },
    { text:'我选择不看账单——不看到就等于不存在', achievements:['金币获取困难'] }
  ]},
  { id:11, module:'经济扫描', cmdLog:'> 正在扫描 [经济模块·住房] …', question:'你的住房现状？', options:[
    { text:'自己买的，无贷或已还清 — 全服稀有成就', achievements:['全款置业'] },
    { text:'有房贷但还得起 — 标准的「成年人负重前行」副本', achievements:[] },
    { text:'租房 — 每个月给房东贡献金币，俗称「氪金交租」', achievements:['金币获取困难'] },
    { text:'和父母/朋友住 — 社交羁绊Buff，但独立空间Debuff', achievements:[] }
  ]},
  { id:12, module:'经济扫描', cmdLog:'> 正在扫描 [经济模块·评价] …', question:'如果要给「钱」这个游戏道具写一句评价？', options:[
    { text:'「获取难度过高，爆率极低」', achievements:['金币获取困难'] },
    { text:'「建议增加日常任务金币奖励」', achievements:[] },
    { text:'「这个道具本身没什么问题，问题是别人太多了」', achievements:[] },
    { text:'「金币只是数字，快乐才是真·稀有道具」', achievements:[] }
  ]},
  { id:13, module:'社交羁绊', cmdLog:'> 正在扫描 [社交模块·羁绊] …', question:'你有一个认识 10 年以上、凌晨三点能打电话的人吗？', options:[
    { text:'有，不止一个——这是我在地球Online最珍贵的装备', achievements:['真心羁绊'] },
    { text:'有一个——系统保留了一个不会被更新删除的好友位', achievements:['真心羁绊'] },
    { text:'曾经有，但版本更新后好友栏灰了', achievements:[] },
    { text:'没有——我的社交栏主打一个「轻量级生存」', achievements:[] }
  ]},
  { id:14, module:'社交羁绊', cmdLog:'> 正在扫描 [社交模块·角色] …', question:'你在人群中的角色最接近？', options:[
    { text:'气氛组——聚会的灵魂，群聊的发动机', achievements:[] },
    { text:'观察者——角落静静看大家表演，内心弹幕刷屏', achievements:['NPC觉醒'] },
    { text:'被迫社交型——「好的」「收到」「哈哈哈」', achievements:[] },
    { text:'看情况——熟人面前是A，陌生人面前是NPC', achievements:[] }
  ]},
  { id:15, module:'社交羁绊', cmdLog:'> 正在扫描 [社交模块·NPC] …', question:'关于「上班/上学的自己像NPC」这个说法，你——', options:[
    { text:'草，这就是我！每天固定路线固定台词固定表情', achievements:['NPC觉醒'] },
    { text:'偶尔有这种感觉，但大部分时候我还是主角', achievements:[] },
    { text:'不觉得——NPC至少不会被老板骂', achievements:['退游按钮不存在'] },
    { text:'我连NPC都不如——NPC不用加班', achievements:['退游按钮不存在'] }
  ]},
  { id:16, module:'社交羁绊', cmdLog:'> 正在扫描 [社交模块·删号] …', question:'你上一次「差点想删号重开」是因为？', options:[
    { text:'工作/学业副本太难，攻略查不到', achievements:['退游按钮不存在'] },
    { text:'感情支线 bug 太多，不知道哪个选项是对的', achievements:['退游按钮不存在'] },
    { text:'经济系统失衡——别人氪金我吃土', achievements:['金币获取困难'] },
    { text:'没想过——虽然这游戏垃圾但我还在玩', achievements:['BUG共生体'] }
  ]},
  { id:17, module:'隐藏属性', cmdLog:'> 正在扫描 [隐藏属性·热爱] …', question:'你还在做小时候喜欢的那些事吗？（画画/弹琴/踢球/写东西/看星星……）', options:[
    { text:'在！而且它现在是我的职业/副业——初心变现了', achievements:['初心未改'] },
    { text:'偶尔还会——像打开一个旧存档，手感还在', achievements:['初心未改'] },
    { text:'想，但每次都被「等有空了」打败', achievements:['空想行动派'] },
    { text:'早就被社会规训副本洗掉了——连想都想不起来了', achievements:[] }
  ]},
  { id:18, module:'隐藏属性', cmdLog:'> 正在扫描 [隐藏属性·作息] …', question:'你的「生活规律度」最接近？', options:[
    { text:'固定作息+固定三餐——我是一台生物钟精准的人形机器', achievements:['自律传说'] },
    { text:'大体规律，偶尔崩——人类正常波动范围', achievements:[] },
    { text:'混乱中立——工作日规律，周末直接删档', achievements:[] },
    { text:'我的作息是一个随机数生成器——没有人能预测我什么时候醒', achievements:['凌晨三点常驻者'] }
  ]},
  { id:19, module:'隐藏属性', cmdLog:'> 正在扫描 [隐藏属性·风景] …', question:'你上一次「停下来认真看日落/拍下一张风景」是？', options:[
    { text:'这周——画面还在我相册里', achievements:['落日收藏家'] },
    { text:'上个月——当时觉得好看就拍了', achievements:['落日收藏家'] },
    { text:'去年——翻相册才发现上次拍已经是去年', achievements:[] },
    { text:'什么是「停下来」？我好像一直在跑图', achievements:[] }
  ]},
  { id:20, module:'隐藏属性', cmdLog:'> 正在扫描 [隐藏属性·地图] …', question:'你出过国吗？护照上盖了几个章？', options:[
    { text:'出过，多个国家——DLC「异国地图包」已全部加载', achievements:['海外地图已扩展'] },
    { text:'出过1-2次——至少解锁了「装X时用英文」对话选项', achievements:['海外地图已扩展'] },
    { text:'没出过——但护照已经办好了，随时准备出发', achievements:[] },
    { text:'没出过——国内服务器内容已经够我探索了', achievements:[] }
  ]},
  { id:21, module:'终章审判', cmdLog:'> 正在扫描 [终章·态度] …', question:'用一句话描述你对「地球Online这款游戏」的态度？', options:[
    { text:'「BUG 很多，官方不修，但凑合能玩」', achievements:['BUG共生体'] },
    { text:'「策划有问题，但风景是真的好」', achievements:[] },
    { text:'「垃圾游戏，毁我青春，但我还在线」', achievements:[] },
    { text:'「虽然没攻略没存档，但我这局打得还行」', achievements:[] }
  ]},
  { id:22, module:'终章审判', cmdLog:'> 正在扫描 [终章·差评] …', question:'如果地球Online真有「差评入口」，你会打几星？', options:[
    { text:'★★☆☆☆ — 平衡性极差，氪金玩家体验远优于零氪', achievements:[] },
    { text:'★★★☆☆ — 垃圾但凑合能玩，偶尔有意外之喜', achievements:[] },
    { text:'★★★★☆ — 虽然策划不做人，但支线剧情还可以', achievements:[] },
    { text:'★★★★★ — 带我来这游戏的两个老玩家对我很好', achievements:[] }
  ]},
  { id:23, module:'终章审判', cmdLog:'> 正在扫描 [终章·更新] …', question:'你觉得地球Online最需要「版本更新」修复的是什么？', options:[
    { text:'经济系统——金币获取难度过高，贫富差距太大', achievements:['金币获取困难'] },
    { text:'健康机制——为什么熬夜会扣血！这不合理！', achievements:['蚊子没削弱'] },
    { text:'社交匹配——找一个能一起打副本的人太难了', achievements:[] },
    { text:'心理模块——焦虑、内耗这些DEBUFF能不能删掉？', achievements:[] }
  ]},
  { id:24, module:'终章审判', cmdLog:'> 正在扫描 [终章·结语] …', question:'最后一题——你希望你的「玩家评估报告」上写着？', options:[
    { text:'「能活到现在本身就及格了」', achievements:[] },
    { text:'「没有攻略，没有重来，但你的存档不算差」', achievements:[] },
    { text:'「隐藏BOSS级——系统都没想到你能玩这么好」', achievements:[] },
    { text:'「此玩家已学会在BUG周围正常行走，堪称人类适应力巅峰」', achievements:['BUG共生体'] }
  ]}
];

// ═══ 成就库 v4 — 按稀缺度评级排序 ═══
// rarity: S=传说 A=稀有 B=少见 C=常见 D=反向成就
// rank: 全成就排序编号 1-18

var ACHIEVEMENTS = {
  // ═══ S级·传说 (全服<10%) ═══
  '全款置业':       { rarity:'S', rank:1,  icon:'🏠', name:'全款置业',   desc:'传奇成就。您跳过了贷款DEBUFF剧情线。全服仅约4%玩家达成。请务必在评论区教教大家——当然我们知道你不会说。', type:'full' },
  '初心未改':       { rarity:'S', rank:2,  icon:'🌱', name:'初心未改',   desc:'稀有隐藏成就。多数玩家在社会规训副本中被洗掉该文件，您居然没丢。那个小孩还在系统后台默默运行着。', type:'full' },
  '自律传说':       { rarity:'S', rank:3,  icon:'⏰', name:'自律传说',   desc:'检测到异常数据——生物钟未被资本扭曲。全服仅7%玩家达成。系统怀疑您是BUG，建议上报审核。', type:'full' },

  // ═══ A级·稀有 (全服10-30%) ═══
  '经济断奶':       { rarity:'A', rank:4,  icon:'🍼', name:'经济断奶',   desc:'罕见被动技能已解锁。其他玩家还在领新手村补给，您已自己种田。新手保护期已过期——但您不需要了。', type:'full' },
  '真心羁绊':       { rarity:'A', rank:5,  icon:'🤝', name:'真心羁绊',   desc:'社交质量大于社交数量。系统为您保留了一个不会被版本更新删除的好友位。这是掉落率最低的稀有道具。', type:'full' },
  '落日收藏家':     { rarity:'A', rank:6,  icon:'🌅', name:'落日收藏家', desc:'任务循环中检测到暂停指令。风景数据不计入经验值，但已写入核心记忆分区永久保存——在肝任务途中还记得按暂停。', type:'full' },
  '海外地图已扩展': { rarity:'A', rank:7,  icon:'🌏', name:'海外地图已扩展', desc:'DLC异国地图包已加载。可解锁对话选项：偶尔在聊天中蹦几个英文单词时的微妙优越感。护照是最贵的道具之一。', type:'full' },

  // ═══ B级·少见 (全服30-60%) ═══
  '通勤耐力MAX':   { rarity:'B', rank:8,  icon:'🚇', name:'通勤耐力MAX', desc:'跑图循环五百余次。脚底板耐久度接近临界值。系统建议申请仿生义体替换件——或者至少买双好鞋。', type:'full' },
  '强制在线':       { rarity:'B', rank:9,  icon:'🏆', name:'强制在线第N天', desc:'连续存活八千余天未删号。系统判定：玩家可能已遗忘登出指令，或根本不存在退出按钮。全服排名前列。', type:'full' },
  '外卖至尊VIP':   { rarity:'B', rank:10, icon:'🍜', name:'外卖至尊VIP', desc:'本地商家关系网已达挚友级。系统已记录您的偏好：不加香菜。雨天自动附赠补给筷子一双——这是地球Online最稳定的支线关系。', type:'full' },

  // ═══ C级·常见 (全服>60%) ═══
  '凌晨三点常驻者': { rarity:'C', rank:11, icon:'🦉', name:'凌晨三点常驻者', desc:'服务器维护时段仍保持活跃。系统已警告三次——但也知道说了你也不听。健康值DEBUFF持续叠加中。', type:'full' },
  '空想行动派':     { rarity:'C', rank:12, icon:'📋', name:'空想行动派',   desc:'计划制定技能满级，执行转化率持续低迷。收藏夹347条已读3条。想得挺美，做得挺少——系统锐评。', type:'full' },
  'NPC觉醒':        { rarity:'C', rank:13, icon:'🎭', name:'NPC觉醒',      desc:'您已连续多日怀疑自己是某个高玩的随从NPC。真相是：您就是主角——只是当前这条剧情线，写得确实烂。', type:'full' },
  '金币获取困难':   { rarity:'C', rank:14, icon:'💸', name:'金币获取困难', desc:'系统检测到您的金币获取速率低于服务器平均水平。这不是BUG——这是国服的基础难度设定。别自责。', type:'full' },

  // ═══ D级·反向成就(差评体) ═══
  '退游按钮不存在': { rarity:'D', rank:15, icon:'🚫', name:'退游按钮不存在', desc:'没说要玩，自动下载了。找不到退出键，销不了号。你提交的退游申请已被系统驳回——理由：找不到接盘侠。附赠安慰金币×0。', type:'showcase' },
  '捏脸系统崩坏':   { rarity:'D', rank:16, icon:'🎲', name:'捏脸系统崩坏',   desc:'纯随机建模。性别不能自选，角色身上有个合不上的漏洞。后期改外貌还要充钱——策划到底玩不玩自己做的游戏？女号每月自动扣血的bug至今未修。', type:'showcase' },
  '蚊子没削弱':     { rarity:'D', rank:17, icon:'🦟', name:'蚊子没削弱',     desc:'夏天出门就掉血的bug至今未修。蚊子攻击力过高，夜间突袭判定离谱。全服玩家联名请愿削弱——策划：已读，不回。建议自行购买蚊帐DLC。', type:'showcase' },
  'BUG共生体':      { rarity:'D', rank:18, icon:'💀', name:'BUG共生体',      desc:'已知漏洞规避路径已录入系统。官方补丁将不被部署。您已学会在BUG周围正常行走——这，就是人类终极适应力的巅峰。', type:'showcase' }
};

// ═══ 差评墙 ═══
var WALL_REVIEWS = [
  {stars:1,text:'蚊子攻击力太高了，求削弱',player:'#382910'},{stars:1,text:'出生没捏脸就算了，还给了个合不上的建模漏洞',player:'#001837'},
  {stars:1,text:'没有退游按钮，差评',player:'#729103'},{stars:1,text:'金币太难获取了',player:'#554201'},
  {stars:1,text:'我没说要玩，自动下载了还退不出去',player:'#103948'},{stars:1,text:'各服务器版本差距过大',player:'#884502'},
  {stars:1,text:'氪金玩家太多影响正常体验',player:'#332109'},{stars:1,text:'女号每个月自动扣血的bug什么时候修？',player:'#665301'},
  {stars:1,text:'日常副本「上班」太肝了，奖励少还掉健康值',player:'#448201'},{stars:1,text:'睡眠系统老是进不去，差评',player:'#990172'},
  {stars:1,text:'夏天出门就掉血的bug什么时候修复？',player:'#221098'},{stars:1,text:'数学安装包在哪我一直没找着',player:'#773401'},
  {stars:1,text:'不赠送摇杆，就送了两个小号的捏捏乐',player:'#120983'},{stars:1,text:'逆天匹配机制，四面楚歌',player:'#556789'},
  {stars:1,text:'初始金币每个人都不一样，想退游',player:'#334210'},{stars:1,text:'来之前没人和我说这是男性向游戏啊！',player:'#998210'},
  {stars:1,text:'角色建模不能改太吃配置了',player:'#442109'},{stars:1,text:'什么时候出怀旧服？',player:'#663401'},
  {stars:1,text:'落地保护都没有，差评',player:'#110093'},{stars:1,text:'每天都要吃饭喝水太麻烦了',player:'#882109'}
];

// ═══ 等级映射 ═══
var GRADE_MAP = {
  S:{min:78,title:'隐藏BOSS级',msg:'系统都没想到你能玩这么好——你是不是偷偷开了控制台？全服顶尖数据，建议截图裱起来当传家宝。'},
  A:{min:68,title:'高玩潜质',msg:'主线支线都能肝，装备掉落率也不错。可惜这游戏没有氪金通道——不然你现在应该在排行榜首页。'},
  B:{min:58,title:'正经玩家',msg:'踏踏实实打主线，偶尔摸摸支线鱼。不靠欧气不靠氪——你是地球Online最稳定的在线用户画像。'},
  C:{min:48,title:'及格线守门员',msg:'能活到现在本身就及格了。这游戏没有攻略没有重来——你还在线，就已经比很多人强了。'},
  D:{min:0,title:'BUG受害者联盟',msg:'系统BUG的受害者，资本机制的幸存者，生活副本的挨打王。但你还在——这本身就是一个传奇。'}
};

// ═══ 按稀有度排序获取成就 ═══
function getAchievementsSorted(achievementKeys) {
  return achievementKeys
    .filter(function(k) { return ACHIEVEMENTS[k]; })
    .sort(function(a, b) { return (ACHIEVEMENTS[a].rank || 99) - (ACHIEVEMENTS[b].rank || 99); });
}
