var Sequelize = require('sequelize');
var db = require('./index').DB;
var Group = require('./group');
var User = require('./user');

// 创建 model
var GroupUser = db.define('group_user', {

}, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
  });

// 前者将拥有后者的get/set/add/create/remove/has方法
User.belongsToMany(Group, { through: GroupUser });

// 前者将拥有后者的get/set/add/create/remove/has方法
Group.belongsToMany(User, { through: GroupUser });

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
GroupUser.sync({ force: false });

module.exports = GroupUser; 