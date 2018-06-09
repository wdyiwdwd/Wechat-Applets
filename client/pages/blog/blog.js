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
  onLoad: function () {
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
  uploadPicture() {
    var that = this;

    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          console.log(tempFilePaths[i]);
          wx.uploadFile({
            url: config.host + '/uploadpicture',
            filePath: tempFilePaths[i],
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              'groupid': that.data.groupid
            },  
            name: 'uploadPicture',
            success: function (res) {
              uploadImgCount++;
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
              // to do
              console.log(res.data);
              that.setData({
                hasUpload: true,
                showCover: true,
                newPicture: JSON.parse(res.data),
                textFocus: true
              })
              console.log(that.data.newPicture);
            },
            fail: function (res) {
              wx.hideToast();
              console.log(res);
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
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