const express = require('express')
const router = express.Router()
const User = require('../data/models/User')
const Record = require('../data/models/Record')
const jwt = require('../controller/jwt')
const bcrypt = require('bcrypt')
const nodemailder = require('nodemailer')

module.exports = router

const transPort = nodemailder.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    pass: 'cipdczqlytnhglzl',
    user: 'icesylh@gmail.com'
  },
  secure: false // 加密发送
})

router.post('/sendEmail', (req, res) => {
  let { userId, step } = req.body
  User.findOne({ _id: userId }, (err, doc) => {
    if (doc) {
      let options = {
        from: 'icesylh@gmail.com',
        to: doc.email,
        subject: '提交申请温馨提示', //邮件主题
        html: `
              <h1>您好，请${step}！`
      }

      transPort.sendMail(options, (err, info) => {
        if (err) {
          res.send({ Code: 500, Msg: err })
        } else {
          res.send({ Code: 200, Msg: '发送成功' })
        }
      })
    } else {
      res.send({ Code: 500, Msg: '未找到该用户' })
    }
  })
})

router.post('/login', (req, res) => {
  let { account, password } = req.body
  User.findOne({ account }, (err, doc) => {
    if (err) res.status(500).send(err)

    if (doc != null) {
      const compare = bcrypt.compareSync(password, doc.password)
      if (compare) {
        let Token = jwt.encrypt(String(doc._id))

        res.send({
          Code: 200,
          Msg: '登录成功',
          Token,
          data: { name: doc.name, type: doc.type }
        })
      } else res.send({ Code: 500, Msg: '密码错误' })
    } else res.send({ Code: 500, Msg: '账号不存在' })
  })
})
var code = ''
router.post('/register', (req, res) => {
  let { account, firstName, lastName, preferredName } = req.body
  User.findOne({ account }, (err, doc) => {
    if (doc) {
      res.send({ Code: 500, Msg: '用户名已存在' })
    } else {

      for (var i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10)
      }
      let options = {
        from: 'icesylh@gmail.com',
        to: account,
        subject: '激活验证码', //邮件主题
        text: '你的验证码:' + code, // 邮件正文
        html: `
              <h1>您好，请注册员工帐号！</h1>,<a href="http://localhost:3000/register?id=${account}&code=${code}">点击完成注册</a>`
      }

      User.create(
        {
          account,
          email: account,
          firstName,
          lastName,
          preferredName,
          password: bcrypt.hashSync('123456', 5)
        },
        (err, doc) => {
          if (err) {
            res.send({ Code: 500, Msg: err })
          }
          const userId = doc._id
          if (userId) {
            const starttime = Date.now()
            Record.create(
              {
                user: userId,
                starttime: `${starttime}`,
                endtime: `${starttime + 2 * 24 * 3600000}`,
                day: '2',
                status: '1',
                id: new Date().getTime()
              },
              (err, doc) => {
                if (err) {
                  res.send({ Code: 500, Msg: err })
                }

                transPort.sendMail(options, (err, info) => {
                  if (err) {
                    res.send({ Code: 500, Msg: err })
                  } else {
                    res.send({ Code: 200, Msg: '注册成功' })
                  }
                })
              }
            )
          }
        }
      )
    }
  })
})
router.post('/forgot', (req, res) => {
  let { account, password } = req.body
  User.findOne({ account }, (err, doc) => {
    if (doc == null) res.send({ Code: 500, Msg: '用户名不存在' })
    if (req.body.code === code) {
      User.updateOne(
        { account: account },
        { $set: { password: bcrypt.hashSync(password, 5) } },
        function (err) {
          res.send({ Code: 200, Msg: '修改成功' })
        }
      )
    } else {
      res.send({ Code: 500, Msg: '您还未发送邮箱验证' })
    }
  })
})
