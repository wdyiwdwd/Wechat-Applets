// testdb.js

var Sequelize = require('sequelize');
var db = require('./index').DB;

// 创建 model
var Group = db.define('group', {
  groupid: {
    type: Sequelize.STRING, // 指定值的类型
  }
}, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
  });

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
Group.sync({ force: false });

module.exports = Group;