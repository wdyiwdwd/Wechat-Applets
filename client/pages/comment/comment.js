var config = require('../config');
var utils = require("../../utils/util.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    theUser: {},
    showCover: false,
    comments: [],
    groupid: '1',
    comment: '',
    toid: '',
    userid: '2',
    textFocus: false
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      toid: options.toid,
      groupid: app.globalData.openGId,
      userid: app.globalData.openid,
    }) 
    console.log(options.toid);
    wx.request({
      url: config.host + '/getuser',
      data: {
        wxid: that.data.toid
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          theUser: res.data
        });
        console.log(res.data)
      },
      fail: function(res) {}
    })
    that.getComments(that.data.toid, that.data.groupid);
  },
  getComments: function(toid, groupid) { 
    var that = this;
    wx.request({
      url: config.host + '/getcomments',
      data: {
        toid: toid,
        groupid: groupid,
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        res.data.forEach(function (item) {
          item.path = config.host + item.path
          item.createdAt = utils.formatDBTime(item.createdAt)
        })
        that.setData({
          comments: res.data
        })
        console.log(that.data.comments);
      },
      fail: function (res) { },
    })
  },
  showAddModal: function() {
     this.setData({
       showCover: true,
       textFocus: true
     }) 
  },
  changeComment(event) {
    this.setData({
      comment: event.detail.value
    })
  },
  addComment: function() {
    var that = this;
    wx.request({
      url: config.host + '/addcomment',
      data: {
        groupid: that.data.groupid,
        fromid: that.data.userid,
        toid: that.data.toid,
        content: that.data.comment
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        res.data.createdAt = utils.formatDBTime(res.data.createdAt)
        that.data.comments.splice(0, 0, res.data);
        that.setData({
          comment: '',
          textFocus: false,
          showCover: false
        });
        that.getComments(that.data.toid, that.data.groupid);
      },
      fail: function(res) {}
    })
  }
})