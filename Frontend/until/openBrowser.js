const { exec } = require("child_process");
//传入url
module.exports = function (url) {
  // 拿到当前系统的参数
  console.log(url);
  switch (process.platform) {
    case "darwin": //mac
      exec(`open ${url}/admin`);
      break;

    case "win32": //win
      exec(`start ${url}/admin`);
      break;

    case "linux": //linux
      exec("xdg-open", [url + "/admin"]);
      break;

    default:
      // 默认mac
      exec(`open ${url}/admin`);
  }
};
