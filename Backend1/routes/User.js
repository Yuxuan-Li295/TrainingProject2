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
  secure: false // encrypted send
})

router.post('/sendEmail', (req, res) => {
  let { userId, step } = req.body
  User.findOne({ _id: userId }, (_, doc) => {
    if (doc) {
      let options = {
        from: 'icesylh@gmail.com',
        to: doc.email,
        subject: 'Hello, warm reminding for submitting applications', //Email theme
        html: `
              <h1>Hello，please${step}！`
      }

      transPort.sendMail(options, (err) => {
        if (err) {
          res.send({ Code: 500, Msg: err })
        } else {
          res.send({ Code: 200, Msg: 'Send successfully' })
        }
      })
    } else {
      res.send({ Code: 500, Msg: 'User not found' })
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
          Msg: 'Login Successfully',
          Token,
          data: { name: doc.name, type: doc.type }
        })
      } else res.send({ Code: 500, Msg: 'Password Incorrect' })
    } else res.send({ Code: 500, Msg: 'Account does not exists' })
  })
})
var code = ''
router.post('/register', (req, res) => {
  let { account, firstName, lastName, preferredName } = req.body
  User.findOne({ account }, (_, doc) => {
    if (doc) {
      res.send({ Code: 500, Msg: 'Username already exists' })
    } else {

      for (var i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10)
      }
      let options = {
        from: 'icesylh@gmail.com',
        to: account,
        subject: 'Activation code', //Email subject
        text: 'Your verification code' + code, // Email main contents
        html: `
              <h1>Hello! Please register for an employee account</h1>,<a href="http://localhost:3000/register?id=${account}&code=${code}">Click to complete registration</a>`
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
                id: new Date().getTime()
              },
              (err, doc) => {
                if (err) {
                  res.send({ Code: 500, Msg: err })
                }

                transPort.sendMail(options, (err) => {
                  if (err) {
                    res.send({ Code: 500, Msg: err })
                  } else {
                    res.send({ Code: 200, Msg: 'Register successfully' })
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
  User.findOne({ account }, (_, doc) => {
    if (doc == null) res.send({ Code: 500, Msg: 'Username does not exist' })
    if (req.body.code === code) {
      User.updateOne(
        { account: account },
        { $set: { password: bcrypt.hashSync(password, 5) } },
        function (err) {
          res.send({ Code: 200, Msg: 'Modify successfully' })
        }
      )
    } else {
      res.send({ Code: 500, Msg: 'You have not yet sent the email verification' })
    }
  })
})

router.post('/sendCode', (req, res) => {
  let { account } = req.body
  User.findOne({ account }, (err, doc) => {
    if (doc == null) res.send({ Code: 500, Msg: 'User name does not exist' })

    for (var i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10)
    }
    let options = {
      from: 'icesylh@gmail.com',
      to: account,
      subject: 'Activation code',
      text: 'Your verification code:' + code,
      html: `
            <h1>Hi, your email has been sent!</h1>,<a href="http://localhost:3000/forgot?id=${account}&code=${code}">点击修改密码</a>`
    }

    transPort.sendMail(options, (err, info) => {
      if (err) {
        res.send({ Code: 500, Msg: err })
      } else {
        res.send({ Code: 200, Msg: 'Sent successfully' })
      }
    })
  })
})
