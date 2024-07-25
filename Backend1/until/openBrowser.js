const { exec } = require("child_process");
//Pass in the url
module.exports = function (url) {
  //Get the current system parameters
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
      // Default mac
      exec(`open ${url}/admin`);
  }
};
