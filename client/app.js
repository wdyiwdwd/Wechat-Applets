//app.js
var config = require('./pages/config');

App({
  globalData: {
    appid: 'wxb7be4acbca4aa702',
    secret: '783aa7596ce1e457cf77c5b3e8ec81fe',
    isFirst: null,
    openid: null,
    sessionKey: null,
    openGId: null,
    userInfo: {},
    scene: null
  },
  onShow: function (options) {
    var that = this;
    that.globalData.scene=options.scene;
    // 登录
    wx.login({
      success: function(res) {
        if(res.code) {
          // var apiurl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          // 获取openid
          wx.request({
            url: config.host + '/getopenid',
            data: {
              code: res.code,
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {
              //console.log("openid", res.data);
              that.globalData.openid = res.data.openid;
              that.globalData.sessionKey = res.data.session_key;
              //console.log(that.globalData.openid);
              // 从群进入，获取群id
              if (options.scene == 1044) {
                wx.getShareInfo({
                  shareTicket: options.shareTicket,
                  success: function (res) {
                    //console.log(res);
                    var temp = res;
                    // 解密
                    wx.request({
                      url: config.host + '/getGid',
                      data: {
                        appid: that.globalData.appid,
                        sessionKey: that.globalData.sessionKey,
                        encryptedData: temp.encryptedData,
                        iv: temp.iv
                      },
                      success: function (res) {
                        //console.log(res.data);
                        var temp=res;
                        // 群关系插入数据库
                        wx.request({
                          url: config.host + '/joinGroup',
                          data: {
                            wxid: that.globalData.openid,
                            openGId: temp.data.openGId
                          },
                          success: function (res) {
                            console.log(res.data);
                            that.globalData.openGId = temp.data.openGId;
                            // 确保页面渲染
                            if (that.openGIdReadyCallback) {
                              that.openGIdReadyCallback(temp)
                            }
                          },
                          fail: function () {
                            console.log("joinGroup error!")
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
              }
              //查看用户是否初次使用
              wx.request({
                url: config.host + '/isFirst',
                data: {
                  openid: that.globalData.openid
                },
                success: function (res) {
                  //console.log(res.data.isFirst);
                  that.globalData.isFirst = res.data.isFirst;
                  if(!that.globalData.isFirst) {
                    that.globalData.userInfo.nickname = res.data.nickname;
                    that.globalData.userInfo.avatar = res.data.avatar;
                  }
                  // 确保页面渲染
                  if (that.isFirstReadyCallback) {
                    that.isFirstReadyCallback(res)
                  }
                },
                fail: function () {
                  console.log('isFirst error!');
                }
              })
            },
            fail: function() {
              console.log('获取openid失败')
            }
          })
        } else {
          console.log('登录失败！'+res.errMsg)
        }
      }
    })
  }  
})