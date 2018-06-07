//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    current: 0,
    isFirst: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    questions: [
      {
        wine: '白酒',
        question: '您的白酒酒量是：',
        answers: {
          a: '3两以下',
          b: '3-5两',
          c: '5两-1斤',
          d: '1斤以上'
        }
      },
      {
        wine: '红酒',
        question: '您的红酒酒量是：',
        answers: {
          a: '3两以下',
          b: '3-5两',
          c: '5两-1斤',
          d: '1斤以上'
        }
      },
      {
        wine: '啤酒',
        question: '您的啤酒酒量是：',
        answers: {
          a: '3两以下',
          b: '3-5两',
          c: '5两-1斤',
          d: '1斤以上'
        }
      }
    ],
    choosedAnswer: []
  },
  // 事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 判断是否初次使用
  onLoad: function () {
    if(app.globalData.isFirst) {
      this.setData({
        isFirst: app.globalData.isFirst
      })
    } else {
      app.isFirstReadyCallback = res => {
        this.setData({
          isFirst: res.data.isFirst
        })
      }
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // 转发响应，获取目标群id
  onShareAppMessage: function(res) {
    return {
      //title:
      //path: '/pages/logs/logs',
      //imageUrl:
      success: function(res) {
        console.log(res.shareTickets[0]);
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            console.log(res);
            var temp = res;
            // 解密
            wx.request({
              url: 'http://localhost:3000/getGid',
              data: {
                appid: app.globalData.appid,
                sessionKey: app.globalData.sessionKey,
                encryptedData: temp.encryptedData,
                iv: temp.iv
              },
              success: function (res) {
                console.log(res.data);
                app.globalData.openGId = res.data.openGId;
                // 群关系插入数据库
                wx.request({
                  url: 'http://localhost:3000/onShare',
                  data: {
                    wxid: app.globalData.openid,
                    openGId: app.globalData.openGId
                  },
                  success: function (res) {
                    console.log(res.data)
                  },
                  fail: function () {
                    console.log("onShare error!")
                  }
                })
              },
              fail: function () {
                console.log('getGid error!');
              }
            })
          },
          fail: function () {
            console.log('shareInfo error!');
          }
        })
      },
      fail: function() {
        console.log('share error!');
      }
    }
  },

  swiperChange: function(e) {
    console.log(e.detail.current);
    this.setData({
      current: e.detail.current
    })
  },

  radioChange: function(e) {
    console.log(this.data.current);
    this.data.choosedAnswer[this.data.current]=e.detail.value;
    console.log(this.data.choosedAnswer);
  },

  selfDone: function () {
    var that=this;
    var theUrl = "http://localhost:3000/selfInitial" 
    wx.request({
      url: theUrl,
      data: {
        wxid: app.globalData.openid,
        openGId: app.globalData.openGId,
        nickname: that.data.userInfo.nickName,
        avatar: that.data.userInfo.avatarUrl,
        questions: that.data.questions,
        choosedAnswer: that.data.choosedAnswer
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          isFirst: false
        })
      },
      fail: function () {
        console.log("selfDone error!")
      }
    })
  },
  goBlog: function() {
    wx.navigateTo({
      url: '../blog/blog',
    })
  },
  goList: function () {
    wx.navigateTo({
      url: '../list/list',
    })
  },
  goComment: function () {
    wx.navigateTo({
      url: '../comment/comment',
    })
  },

  bindGetUserInfo: function(e) {
    console.log(e);
    if(e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo
      })
      this.selfDone();
    }
  }
})
