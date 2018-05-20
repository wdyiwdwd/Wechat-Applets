var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  name: '大家的酒量', // 社区名字
  description: '一款微信小程序', // 社区的描述
  keywords: 'nodejs, node, express, connect',

  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/testdb',


  // 程序运行的端口
  port: 3000,

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, '/upload/'),
    url: '/upload/'
  },

  file_limit: '1MB',


  // create_post_per_day: 1000, // 每个用户一天可以发的主题数
  // create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  // create_user_per_ip: 1000,
  // visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;