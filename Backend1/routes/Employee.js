const express = require('express')
const router = express.Router()
const User = require('../data/models/User')
const Record = require('../data/models/Record')
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
      Msg: 'Request Successfully',
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
        Msg: 'Request successfully',
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
        Msg: 'Request Successfully',
        data: doc
      })
    })
  }
})

router.post('/update/:username', async (req, res) => {
  const { username } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findOneAndUpdate({ account: username }, updateData, { new: true }).exec();
    if (!user) {
      return res.status(404).send({
        Code: 404,
        Msg: 'User Not Found'
      });
    }

    // Find the user's record
    const record = await Record.findOne({ user: user._id }).exec();

    if (record) {
      if (record.onboardingStatus.currentStep === 'not_started') {
        if (user.workAuthorization.title === 'OPT') {
          record.onboardingStatus.currentStep = 'receipt';
        } else {
          console.log(user.workAuthorization.title)
          record.onboardingStatus.currentStep = 'complete';
          record.status = 'complete';
        }
        await record.save();
      }
    }

    res.send({
      Code: 200,
      Msg: 'Update successfully',
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      Code: 500,
      Msg: 'Server Error'
    });
  }
});

router.post('/onboard/:username', (req, res) => {
  const { username } = req.params
  const updateData = req.body

  User.findOneAndUpdate({ account: username }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).send({
        Code: 500,
        Msg: 'Server Error'
      })
    }
    if (!doc) {
      return res.status(404).send({
        Code: 404,
        Msg: 'User Not Found'
      })
    }

    res.send({
      Code: 200,
      Msg: 'Update Successfully',
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
            Msg: 'Unknown server error'
          });
        }
        if (!doc) {
          return res.status(404).send({
            Code: 404,
            Msg: 'User Not Found'
          });
        }
        res.send({
          Code: 200,
          Msg: 'Update Successfully',
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
        Msg: 'Unknown Server Error'
      });
    }
    if (!doc) {
      return res.status(404).send({
        Code: 404,
        Msg: 'User Not Found'
      });
    }
    res.send({
      Code: 200,
      Msg: 'Query Successfully',
      data: doc.userDocuments
    });
  });
});



