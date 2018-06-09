var config = require('../config');
var utils = require("../../utils/util.js")
//获取应用实例
const app = getApp()

Page({
  data: {
    pictures: [],
    showCover: false,
    userid: app.globalData.openid,
    groupid: app.globalData.openGId,
    hasUpload: false,
    newPicture: {},
    remark: '',
    textFocus: false
  },
  onShow: function () {
    var that = this;
    this.setData({
      userid: app.globalData.openid,
      groupid: app.globalData.openGId
    })
    wx.request({
      url: config.host + '/pictures',
      dataType: 'json',
      data: {groupid: that.data.groupid},
      method: 'get',
      success: function (res) {
        console.log(res.data)
        res.data.forEach(function(item) {
          item.path = config.host + item.path
          item.createdAt = utils.formatDBTime(item.createdAt)
        })
        that.setData({
          pictures: res.data
        })
      },
      fail: function () {
      }
    })
  },
  changeRemark(event) {
    this.setData({
      remark: event.detail.value
    })
  },
  hideInput() {
    this.setData({
      showCover: false,
      textFocus: false
    })
  },
  uploadPicture() {
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
    
    }
  },
  addRemark: function() {
    var that = this;
    if(!this.data.hasUpload) {
      wx.showModal({
        title: '错误提示',
        content: '您还没有上传图片',
        showCancel: false,
        success: function (res) { }
      })
    }
    else {
      console.log(that.data.newPicture);
      wx.request({
        url: config.host + '/addremark',
        dataType: 'json',
        data: { 
          remark: that.data.remark,
          pictureId: that.data.newPicture.id
        },
        method: 'post',
        success: function (res) {
          console.log(res.data)
          res.data.createdAt = utils.formatDBTime(res.data.createdAt)
          res.data.path = config.host + res.data.path
          that.data.pictures.splice(0, 0, res.data);
          that.setData({
            pictures: that.data.pictures,
            remark: '',
            showCover: false,
            hasUpload: false,
            textFocus: false
          })
        },
        fail: function () {
        }
      })
    }
  }
})