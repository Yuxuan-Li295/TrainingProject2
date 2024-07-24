const express = require('express')
const router = express.Router()
const User = require('../data/models/User')
const jwt = require("../controller/jwt");

module.exports = router

router.post('/list', (req, res) => {
  let { firstName, lastName, preferredName } = req.body
  User.find({
    firstName: { $regex: new RegExp(firstName, 'i') },
    lastName: { $regex: new RegExp(lastName, 'i') },
    preferredName: { $regex: new RegExp(preferredName, 'i') }
  }).exec((err, doc) => {
    if (err) {
      res.status(500).send(err)
    }
    res.send({
      Code: 200,
      Msg: '请求成功',
      data: doc || []
    })
  })
})
router.post('/info',(req, res) => {
  let { id, username } = req.body
  if(id){
    User.findOne({_id: id}).exec((err, doc) => {
      if (err) {
        res.status(500).send(err)
      }
      res.send({
        Code: 200,
        Msg: '请求成功',
        data: doc
      })
    })
  } else {
    User.findOne({account: username}).exec((err, doc) => {
      if (err) {
        res.status(500).send(err)
      }
      res.send({
        Code: 200,
        Msg: '请求成功',
        data: doc
      })
    })
  }
})

router.post('/update/:username', (req, res) => {
  const { username } = req.params
  const updateData = req.body

  User.findOneAndUpdate({ account: username }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).send({
        Code: 500,
        Msg: '服务器错误'
      })
    }
    if (!doc) {
      return res.status(404).send({
        Code: 404,
        Msg: '用户未找到'
      })
    }
    res.send({
      Code: 200,
      Msg: '更新成功',
      data: doc
    })
  })
})

router.post('/onboard/:username', (req, res) => {
  const { username } = req.params
  const updateData = req.body

  User.findOneAndUpdate({ account: username }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).send({
        Code: 500,
        Msg: '服务器错误'
      })
    }
    if (!doc) {
      return res.status(404).send({
        Code: 404,
        Msg: '用户未找到'
      })
    }

    res.send({
      Code: 200,
      Msg: '更新成功',
      data: doc
    })
  })
})

router.post('/updatefilelist/:username', (req, res) => {
  const { username } = req.params;
  const { userDocuments } = req.body;

  if (!Array.isArray(userDocuments) || !userDocuments.every(doc => doc.name && doc.id)) {
    return res.status(400).send({
      Code: 400,
      Msg: 'Invalid data format. userDocuments should be an array of objects with name and id.'
    });
  }

  User.findOneAndUpdate(
      { account: username },
      { userDocuments },
      { new: true },
      (err, doc) => {
        if (err) {
          return res.status(500).send({
            Code: 500,
            Msg: '服务器错误'
          });
        }
        if (!doc) {
          return res.status(404).send({
            Code: 404,
            Msg: '用户未找到'
          });
        }
        res.send({
          Code: 200,
          Msg: '更新成功',
          data: doc
        });
      }
  );
});


router.get('/getfilelist/:username', (req, res) => {
  const { username } = req.params;

  User.findOne({ account: username }, 'userDocuments', (err, doc) => {
    if (err) {
      return res.status(500).send({
        Code: 500,
        Msg: '服务器错误'
      });
    }
    if (!doc) {
      return res.status(404).send({
        Code: 404,
        Msg: '用户未找到'
      });
    }
    res.send({
      Code: 200,
      Msg: '查询成功',
      data: doc.userDocuments
    });
  });
});



