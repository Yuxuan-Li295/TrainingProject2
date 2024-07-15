const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../data/models/User");

const encrypt = data => {
  // 加密
  const privateKey = fs.readFileSync(path.join(__dirname, "../keys/rsa_private_key.pem"));
  const tk = jwt.sign(data, privateKey, { algorithm: "RS256" });
  return tk;
};

const decrypt = tk => {
  // 解密
  const publicKey = fs.readFileSync(path.join(__dirname, "../keys/rsa_public_key.pem"));
  const result = jwt.verify(tk, publicKey);
  return result;
};

module.exports = {
  decrypt,
  encrypt,
  check: (req, res, next) => {
    // 全局检测token

    try {
      let token = req.headers.authorization;
      let id = decrypt(token);
      User.findById(id, (err, doc) => {
        if (err) res.status(500).send(err);
        if (doc) {
          req.user = id;
          next();
        } else res.send({ Code: 401, Msg: "没有登录状态" });
      });
    } catch (error) {
      res.send({ Code: 401, Msg: "token失效" });
    }
  },
};
