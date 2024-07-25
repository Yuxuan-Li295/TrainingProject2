const express = require('express')
const router = express.Router()
const Record = require('../data/models/Record')
const User = require("../data/models/User");

module.exports = router

const stepsMap = {
  receipt: 'receiptStatus',
  ead_card: 'eadCardStatus',
  i983: 'i983Status',
  i20: 'i20Status'
}

const currentVisaStepEnum = [
  'receipt',
  'ead_card',
  'i983',
  'i20',
]
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
      //console.log(doc)
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
router.post('/info', async (req, res) => {
  const { id, username } = req.body;

  try {
    // 如果提供了id，则查找特定的记录并填充user字段
    if (id) {
      const record = await Record.findOne({ _id: id })
          .populate('user')
          .exec();

      if (!record) {
        return res.status(404).send({ Code: 404, Msg: '记录未找到' });
      }

      return res.send({
        Code: 200,
        Msg: '请求成功',
        data: record
      });
    }
    if (username) {
      const user = await User.findOne({ account: username }).exec();
      if (!user) {
        return res.status(404).send({ Code: 404, Msg: '用户未找到' });
      }

      const records = await Record.find({ user: user._id }).exec();

      return res.send({
        Code: 200,
        Msg: '请求成功',
        data: records
      });
    }
    res.status(400).send({ Code: 400, Msg: '缺少参数：id 或 username' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ Code: 500, Msg: '服务器内部错误', error: err.message });
  }
});

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
      console.log(currentStep)
      if (doc.onboardingStatus[`${stepsMap[currentStep]}`] === 'submitted') {

        const steps = Object.values(stepsMap)
        const index = steps.findIndex((item) => JSON.stringify(item) === JSON.stringify(stepsMap[currentStep]));
        Record.updateOne(
          { _id: id },
          {
            $set: {
              onboardingStatus: {
                ...doc.onboardingStatus,
                [`${stepsMap[currentStep]}`]: 'approved',
                currentStep:
                  index + 1 >= steps.length ? 'complete' : currentVisaStepEnum[index + 1],
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

const visaStepStatusEnum = {
  NOT_SUBMITTED: 'not_submitted',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const documentsFieldMap = {
  receipt: 'RECEIPT',
  ead_card: 'EAD_CARD',
  i983: 'I983_FORM',
  i20: 'I20_FORM',
  others: 'OTHERS'
};

router.post('/updateRecord', async (req, res) => {
  const { username, currentStep, uploadedFiles } = req.body;

  try {
    const user = await User.findOne({ account: username }).exec();
    if (!user) {
      return res.status(404).send({ Code: 404, Msg: '用户未找到' });
    }

    const record = await Record.findOne({ user: user._id }).exec();
    if (!record) {
      return res.status(404).send({ Code: 404, Msg: '记录未找到' });
    }

    // 确保 currentStep 是一个有效的步骤
    if (!documentsFieldMap[currentStep]) {
      return res.status(400).send({ Code: 400, Msg: '无效的 currentStep' });
    }

    // 更新Record的状态和文件列表
    record.onboardingStatus[`${currentStep}Status`] = visaStepStatusEnum.SUBMITTED;
    record.documents[documentsFieldMap[currentStep]] = uploadedFiles;

    await record.save();

    return res.send({ Code: 200, Msg: '记录更新成功' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ Code: 500, Msg: '服务器内部错误', error: err.message });
  }
});
