var config = require('../config');
//获取应用实例
const app = getApp()

Page({
  data: {
    showCover: false,
    comments: [],
    groupid: '1',
    comment: '',
    toid: '',
    userid: '2'
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
      url: config.host + '/getcomments',
      data: {
        toid: options.toid,
        groupid: app.globalData.openGId,
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        that.setData({
          comments: res.data
        })
        console.log(that.data.comments);
      },
      fail: function(res) {},
    })
  },
  showAddModal: function() {
     this.setData({
       showCover: !this.data.showCover,
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
        that.data.comments.push(res.body);
      },
      fail: function(res) {}
    })
  }
})