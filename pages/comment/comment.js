var config = require('../config');

Page({
  data: {
    showCover: false,
    comments: [],
    groupid: '1',
    comment: '',
    toid: '1',
    userid: '2'
  },
  onLoad: function () {
  },
  showAddModal: function() {
     this.setData({
       showCover: !this.data.showCover
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