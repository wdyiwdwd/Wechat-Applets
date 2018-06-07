var config = require('../config');

Page({
  data: {
    pictures: [],
    showCover: false,
    groupid: '1',
    hasUpload: false,
    newPicture: {},
    remark: ''
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: config.host + '/pictures',
      dataType: 'json',
      data: {groupid: that.data.groupid},
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
  },
  changeRemark(event) {
    this.setData({
      remark: event.detail.value
    })
  },
  addPicture() {
    var that = this;
    this.setData({
      showCover: !(that.data.showCover)
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
              that.setData({
                hasUpload: true,
                newPicture: JSON.parse(res.data)
              });
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
          that.data.pictures.push(res.data);
          that.setData({
            pictures: that.data.pictures
          })
          that.addPicture();
        },
        fail: function () {
        }
      })
    }
  }
})