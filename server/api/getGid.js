var WXBizDataCrypt = require('./WXBizDataCrypt')

exports.getGid = function (req, res) {
  var pc = new WXBizDataCrypt(req.query.appid, req.query.sessionKey);
  var data = pc.decryptData(req.query.encryptedData, req.query.iv);
  console.log(data);
  res.send({
    openGId: data.openGId
  })
}