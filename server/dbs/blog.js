var models = require('../models')

const addPictures = async function () {
  models.Group.destroy({where: {}});
  models.Picture.destroy({where: {}});

  var group = await models.Group.create({
    'groupid': '1',
  });

  var picture1 = await models.Picture.create({
    'path': '/upload/1/1.jpg',
    'text': '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。',
  });

  var picture2 = await models.Picture.create({
    'path': '/upload/1/2.jpg',
    'text': '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。',
  });

  group.addPictures([picture1, picture2]);
}

addPictures();