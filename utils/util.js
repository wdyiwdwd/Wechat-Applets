var config = require('../pages/config');
var consts = require('../pages/index/consts');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDBTime = time => {
  return time.substr(0, 10)
}

var getAnswer =  function(wxid, dosomething) {
  wx.request({
    url: config.host + '/getWines',
    data: {
      wxid: wxid,
    },
    success: function (res) {
      var displayAnswer=[
        {
          wine: null,
          answers: null
        },
        {
          wine: null,
          answers: null
        },
        {
          wine: null,
          answers: null
        }];
      for(var i=0;i<consts.questions.length;i++) {
        displayAnswer[i].wine = consts.questions[i].wine;
        displayAnswer[i].answers = '未自评';
      }
      for (var i = 0; i < res.data.length; i++) {
        displayAnswer[res.data[i].type].answers = consts.questions[res.data[i].type].answers[res.data[i].answer];
      }
      dosomething(displayAnswer);
    },
    fail: function () {
      return 'getAnswer error!';
    }
  })
}

var getLevel = function (wxid, dosomething) {
  wx.request({
    url: config.host + '/getuser',
    data: {
      wxid: wxid,
    },
    success: function (res) {
      dosomething(consts.levels[res.data.level]);
    },
    fail: function () {
      return "getLevel error!";
    }
  })
}

var getMotto = function (wxid, dosomething) {
  wx.request({
    url: config.host + '/getuser',
    data: {
      wxid: wxid,
    },
    success: function (res) {
      if (res.data.motto) {
        dosomething(res.data.motto);
      } else {
        dosomething('请输入...')
      }
    },
    fail: function () {
      return "getMotto error!";
    }
  })
}

var getChoosed = function (wxid, dosomething) {
  wx.request({
    url: config.host + '/getWines',
    data: {
      wxid: wxid,
    },
    success: function (res) {
      var choosedAnswer=[];
      for (var i = 0; i < res.data.length; i++) {
        choosedAnswer[res.data[i].type]=res.data[i].answer;
      }
      dosomething(choosedAnswer);
    },
    fail: function () {
      return 'getChoosed error!';
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatDBTime: formatDBTime,
  getAnswer: getAnswer,
  getLevel: getLevel,
  getMotto: getMotto,
  getChoosed: getChoosed
}
