//获取应用实例
const app = getApp()

Page({
  data: {
    groupid: '',
    group: [
      '我',
      '刘德华',
      '张学友',
      '张学友',
    ],
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
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
  }
})
