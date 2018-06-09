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
    textFocus: false,
    displayAnswer:[],
    level:'',
    levelNum: 1, 
    choosedAnswer: []
  },
  onShow: function (options) {
    var that = this;
    this.setData({
      toid: options.toid,
      groupid: app.globalData.openGId,
      userid: app.globalData.openid,
    }) 
    console.log(options.toid);
    utils.getAnswer(that.data.toid, function (data) {
      that.setData({
        displayAnswer: data
      })
    });
    utils.getLevel(that.data.toid, function (data) {
      that.setData({
        level: data
      })
    });
    utils.getChoosed(that.data.toid, function (data) {
      that.setData({
        levelNum: Math.max.apply(null, data),
        choosedAnswer: data,
      })
    });
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
      fail: function (res) { }
    });
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
  hideInput() {
    this.setData({
      showCover: false,
      textFocus: false
    })
  },
  showAddModal: function() {
    if (app.globalData.isFirst === true) {
      wx.showModal({
        title: '提示',
        content: '请先完成自评，再和您的群友一同分享吧~',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      this.setData({
        showCover: true,
        textFocus: true
      })
    } 
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