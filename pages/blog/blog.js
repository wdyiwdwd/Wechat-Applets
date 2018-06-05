var config = require('../config');

Page({
  data: {
    pictures: []
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: config.host + '/pictures',
      dataType: 'json',
      data: {groupid: '1'},
      method: 'get',
      success: function (res) {
        console.log(res.data)
        res.data.forEach(function(item) {
          item.path = config.host + item.path
        })
        that.setData({
          pictures: res.data
        })
      },
      fail: function () {
      }
    })
  }
})