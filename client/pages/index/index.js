//index.js
//获取应用实例
const app = getApp()

// 引入常量
var consts = require('./consts');
var config = require('../config');
var utils = require("../../utils/util.js")

Page({
  data: {
    motto: '请输入饮酒格言...',
    current: 0,
    isFirst: null,
    isEdited: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    questions: consts.questions,
    choosedAnswer: [],
    displayAnswer: [],
    level: null,
    editButton: '修改酒量',
    levelNum: 1,
    pickers: [
      {
        index: null,
        wine: consts.questions[0].wine,
        array: consts.questions[0].answers
      },
      {
        index: null,
        wine: consts.questions[1].wine,
        array: consts.questions[1].answers
      },
      {
        index: null,
        wine: consts.questions[2].wine,
        array: consts.questions[2].answers
      }
    ]
  },
  // 判断是否初次使用
  onShow: function () {
    var that = this;
    if(app.globalData.scene==1044) {
      that.setData({
        isFirst: app.globalData.isFirst
      })
      that.dataInitial(that.data.isFirst);
    }
    if(app.globalData.isFirst) {
      that.setData({
        isFirst: app.globalData.isFirst,
      })
    } else {
      app.isFirstReadyCallback = res => {
        that.dataInitial(res.data.isFirst);
        that.setData({
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
      // title: '大家的酒量',
      path: '/pages/list/list',
      // imageUrl: '../static/logo54.png',
      success: function(res) {
        //console.log(res.shareTickets[0]);
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            //console.log(res);
            var temp = res;
            // 解密
            wx.request({
              url: config.host + '/getGid',
              data: {
                appid: app.globalData.appid,
                sessionKey: app.globalData.sessionKey,
                encryptedData: temp.encryptedData,
                iv: temp.iv
              },
              success: function (res) {
                //console.log(res.data);
                app.globalData.openGId = res.data.openGId;
                // 群关系插入数据库
                wx.request({
                  url: config.host + '/onShare',
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
    //console.log(e.detail.current);
    this.setData({
      current: e.detail.current
    })
  },

  radioChange: function(e) {
    var that=this;
    //console.log(this.data.current);
    this.data.choosedAnswer[this.data.current]=+e.detail.value;
    this.data.pickers[this.data.current].index=+e.detail.value;
    this.setData({
      levelNum: Math.max.apply(null, that.data.choosedAnswer),
      choosedAnswer: that.data.choosedAnswer,
      pickers: that.data.pickers
    })
    //console.log(this.data.choosedAnswer);
    //console.log(this.data.pickers);
  },

  selfDone: function () {
    var that=this;
    wx.request({
      url: config.host + '/selfInitial', 
      data: {
        wxid: app.globalData.openid,
        openGId: app.globalData.openGId,
        nickname: that.data.userInfo.nickName,
        avatar: that.data.userInfo.avatarUrl,
        choosedAnswer: that.data.choosedAnswer
      },
      success: function (res) {
        console.log(res.data);
        utils.getAnswer(app.globalData.openid, function (data) {
          that.setData({
            displayAnswer: data
          })
        });
        utils.getLevel(app.globalData.openid, function (data) {
          that.setData({
            level: data
          })
        });
        that.setData({
          isFirst: false,
        })
        app.globalData.isFirst=false;
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
    var that=this;
    //console.log(e);
    if(e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      that.setData({
        userInfo: e.detail.userInfo
      })
      if(that.data.choosedAnswer.length>0) {
        that.selfDone();
      } else {
        wx.showModal({
          title: '提示',
          content: '请至少自估一项酒量',
          showCancel: false
        })
      }
    } else {
      that.showDetail();
    }
  },

  updateMotto: function(e) {
    this.setData({
      motto: e.detail.value
    })
    var that=this;
    wx.request({
      url: config.host + '/updateMotto',
      data: {
        wxid: app.globalData.openid,
        motto: that.data.motto
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function () {
        console.log("updateMotto error!")
      }
    })
  },

  edit: function () {
    var that=this;
    if(that.data.isEdited===false) {
      that.setData({
        isEdited: true,
        editButton: '完成修改'
      })
    } else {
      wx.request({
        url: config.host + '/updateWines',
        data: {
          wxid: app.globalData.openid,
          choosedAnswer: that.data.choosedAnswer
        },
        success: function (res) {
          console.log(res.data);
          utils.getAnswer(app.globalData.openid, function (data) {
            that.setData({
              displayAnswer: data
            })
          });
          utils.getLevel(app.globalData.openid, function (data) {
            that.setData({
              level: data
            })
          });
          that.setData({
            isEdited: false,
            editButton: '修改酒量'
          })
        },
        fail: function () {
          console.log("updateWines error!")
        }
      })
    }
  },

  bindPickerChange: function(e,index) {
    var that=this;
    this.data.choosedAnswer[index] = +e.detail.value;
    this.data.pickers[index].index = +e.detail.value;
    this.setData({
      levelNum: Math.max.apply(null, that.data.choosedAnswer),
      choosedAnswer: that.data.choosedAnswer,
      pickers: that.data.pickers
    })
    //console.log(this.data.choosedAnswer);
    //console.log(this.data.pickers);
  },

  bindPickerChange0: function(e) {
    this.bindPickerChange(e,0);
  },

  bindPickerChange1: function (e) {
    this.bindPickerChange(e, 1);
  },

  bindPickerChange2: function (e) {
    this.bindPickerChange(e, 2);
  },

  bindPickerCancel: function() {

  },

  dataInitial: function(isFirst) {
    // 非首次进入的数据初始化
    var that = this;
    if (!isFirst) {
      utils.getAnswer(app.globalData.openid, function (data) {
        that.setData({
          displayAnswer: data
        })
      });
      utils.getLevel(app.globalData.openid, function (data) {
        that.setData({
          level: data
        })
      });
      utils.getMotto(app.globalData.openid, function (data) {
        that.setData({
          motto: data
        })
      });
      utils.getChoosed(app.globalData.openid, function (data) {
        for (var i = 0; i < data.length; i++) {
          that.data.pickers[i].index = data[i];
        }
        that.setData({
          levelNum: Math.max.apply(null, data),
          choosedAnswer: data,
          pickers: that.data.pickers
        })
        //console.log(that.data.levelNum);
      });
    }
  },
  showDetail: function() {
    wx.showModal({
      title: '大家的酒量',
      content: '“大家的酒量”是一款记录群成员酒量并可以上传酒局照片纪实的健康饮酒管理小程序，旨在让群成员之间了解相互的酒量并进行监督，避免劝酒不当、饮酒过量的状况。',
      showCancel: false
    })
  }
})
