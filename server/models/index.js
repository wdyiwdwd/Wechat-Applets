var Sequelize = require('sequelize');
var db = require('../config').db;

/*
// new Sequelize(database, [username=null], [password=null], [options={}])
// class Sequelize 接收4个参数，后三个参数是可选的
// 通过uri连接数据库
var sequelize = new Sequelize('mysql://localhost:3306/database', {})
*/

exports.DB = new Sequelize(db.database, db.user, db.password, {
  host: db.host, // 数据库地址
  dialect: db.dialect, // 指定连接的数据库类型
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: db.pool
});

console.log('database connection')

exports.User = require('./user')
exports.Group = require('./group')
exports.GroupUser = require('./group_user.js')
exports.Picture = require('./picture')
exports.Wine = require('./wine')
exports.Comment = require('./comment')
