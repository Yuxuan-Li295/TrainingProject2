const express = require("express");
const router = express.Router();
const Config = require("../data/models/Config");
const jwt = require("../controller/jwt");
module.exports = router;

router
  .route("/")
  .get(jwt.check, (req, res) => {
    Config.findOne({ user: req.user })
      .select("title ICP copyright bottomText")
      .exec((err, doc) => {
        if (err) res.status(500).send(err);
        if (doc === null) {
          Config.create({ user: req.user });
          res.send({});
        } else res.send(doc);
      });
  })
  .put(jwt.check, (req, res) => {
    Config.findOneAndUpdate({ user: req.user }, req.body, err => {
      if (err) res.status(500).send(err);
      res.send({ Code: 200, Msg: "Saved Successfully" });
    });
  });
