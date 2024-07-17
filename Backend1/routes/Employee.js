const express = require('express')
const router = express.Router()
const User = require('../data/models/User')

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
router.post('/info', (req, res) => {
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
