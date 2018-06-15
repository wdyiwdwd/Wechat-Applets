var config = require('../config');

//获取应用实例
const app = getApp()

Page({
  data: {
    openid: app.globalData.openid,
    groupid: app.globalData.openGId,
    group: [
    ],
  },
  onShow: function () {
    //console.log(app.globalData.openGId);
    var that = this;
    this.setData({
      openid: app.globalData.openid,
      groupid: app.globalData.openGId,
      hasUserInfo: true
    })
    if(app.globalData.openGId) {
      wx.request({
        url: config.host + '/getusers',
        data: {
          groupid: app.globalData.openGId
        },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          //console.log(res.data);
          that.setData({
            group: res.data
          })
        },
        fail: function (res) { }
      })
    } else {
      app.openGIdReadyCallback = res => {
        wx.request({
          url: config.host + '/getusers',
          data: {
            groupid: res.data.openGId
          },
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            //console.log(res.data);
            that.setData({
              group: res.data
            })
          },
          fail: function (res) { }
        })
      }
    }
  },
  returnIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  goBlog: function () {
    wx.navigateTo({
      url: '../blog/blog',
    })
  },
  lookDetail: function (e) {
    //console.log(e);
    var index = e.currentTarget.dataset.index;
    //console.log(e.currentTarget.dataset.index)
    //console.log(this.data.openid)
    //console.log(this.data.group[index].wxid)
    wx.navigateTo({
      url: '../comment/comment?toid=' + this.data.group[index].wxid,
    })
    // if(this.data.openid === this.data.group[index].wxid) {
    //   wx.navigateTo({
    //     url: '../index/index',
    //   })
    // }
    // else {
    //   wx.navigateTo({
    //     url: '../comment/comment?toid=' + this.data.group[index].wxid,
    //   })
    // }
  }
})
