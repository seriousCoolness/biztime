/** Server startup for BizTime. */


const app = require("./app");

process.env.NODE_ENV = 'dev';

app.listen(3000, function () {
  console.log("Listening on 3000");
});