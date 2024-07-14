const express = require('express')
const router = express.Router()
const Record = require('../data/models/Record')

module.exports = router

const stepsMap = {
  receipt: 'receiptStatus',
  ead_card: 'eadCardStatus',
  i983: 'i983Status',
  I20: 'i20Status'
}
router.post('/list', (req, res) => {
  let { firstName, lastName, preferredName, status } = req.body

  let queryParams = {}

  if (status == 1) {
    queryParams.status = {
      $not: { $eq: 'complete' }
    }
  }
  if (
    status == 'submitted' ||
    status == 'approved' ||
    status == 'rejected' ||
    status == 'complete'
  ) {
    queryParams.status = status
  }
  console.log(queryParams)
  Record.find(queryParams)
    .populate('user')
    .exec((err, doc) => {
      if (err) {
        res.status(500).send(err)
      }
      console.log(doc)
      const list = doc.filter((item) => {
        let flag = true
        if (firstName) {
          if (item.user.firstName.indexOf(firstName) === -1) {
            flag = false
          }
        }
        if (lastName) {
          if (item.user.lastName.indexOf(lastName) === -1) {
            flag = false
          }
        }
        if (preferredName) {
          if (item.user.preferredName.indexOf(preferredName) === -1) {
            flag = false
          }
        }
        return flag
      })

      res.send({
        Code: 200,
        Msg: '请求成功',
        data: { list: list }
      })
    })
})
router.post('/info', (req, res) => {
  let { id } = req.body
  Record.findOne({ _id: id })
    .populate('user')
    .exec((err, doc) => {
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

router.post('/agree', (req, res) => {
  let { id } = req.body
  Record.findOne({ _id: id }).exec((err, doc) => {
    if (err) {
      res.status(500).send(err)
    }
    const currentStep = doc.onboardingStatus.currentStep

    if (currentStep === 'not_started' || currentStep === 'complete') {
      res.send({
        Code: 500,
        Msg: '不可操作'
      })
    } else {
      if (doc.onboardingStatus[`${stepsMap[currentStep]}`] === 'submitted') {
        const steps = Object.values(stepsMap)
        const index = steps.findIndex((item) => `${stepsMap[currentStep]}`)
        Record.updateOne(
          { _id: id },
          {
            $set: {
              onboardingStatus: {
                ...doc.onboardingStatus,
                [`${stepsMap[currentStep]}`]: 'approved',
                currentStep:
                  index + 1 >= steps.length ? 'complete' : steps[index + 1],
                currentFeedback: ''
              },
              status: index + 1 >= steps.length ? 'complete' : 'approved'
            }
          },
          function (err) {
            res.send({ Code: 200, Msg: '操作成功' })
          }
        )
      } else {
        res.send({
          Code: 500,
          Msg: '不可操作'
        })
      }
    }
  })
})

router.post('/refuse', (req, res) => {
  let { id, feedback } = req.body
  Record.findOne({ _id: id }).exec((err, doc) => {
    if (err) {
      res.status(500).send(err)
    }
    const currentStep = doc.onboardingStatus.currentStep

    if (currentStep === 'not_started' || currentStep === 'complete') {
      res.send({
        Code: 500,
        Msg: '不可操作'
      })
    } else {
      if (doc.onboardingStatus[`${stepsMap[currentStep]}`] === 'submitted') {
        Record.updateOne(
          { _id: id },
          {
            $set: {
              onboardingStatus: {
                ...doc.onboardingStatus,
                [`${stepsMap[currentStep]}`]: 'rejected',
                currentFeedback: feedback
              },
              status: 'rejected'
            }
          },
          function (err) {
            res.send({ Code: 200, Msg: '操作成功' })
          }
        )
      } else {
        res.send({
          Code: 500,
          Msg: '不可操作'
        })
      }
    }
  })
})
