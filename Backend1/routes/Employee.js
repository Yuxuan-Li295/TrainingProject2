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
  let { id } = req.body
  User.findOne({ _id: id }).exec((err, doc) => {
    if (err) {
      res.status(500).send(err)
    }
    res.send({
      Code: 200,
      Msg: '请求成功',
      data: doc
    })
  })
})
