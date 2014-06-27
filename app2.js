var express = require('express');
var nodemailer = require("nodemailer");
var http = require('http');
var fs = require('fs');
var app = express();
var mysql = require('mysql');
var logger = require('morgan');
var bodyParser = require('body-parser');

var accessLog = fs.createWriteStream('access.log', {
  flags: 'a'
});
var errorLog = fs.createWriteStream('error.log', {
  flags: 'a'
});

var db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.MYSQL_NAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE
});

db.connect(function (err) {
  if (err) {
    return console.log('error connecting: ' + err.stack);
  }
  return console.log('connected as id ' + db.threadId);
});




var smtpTransport = nodemailer.createTransport("SMTP", {
  host: "smtp.exmail.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: process.env.EMAIL_NAME, // 账号
    pass: process.env.EMAIL_PWD // 密码
  }
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(logger({
  stream: accessLog
}));

console.log(process.env);
console.log(process.env.DATABASE);
/*
console.log('Current directory: ' + process.cwd());
*/
app.post('/send', function (req, res) {
  /*接受参数*/
  var sellerID = req.body.sellerID;
  var sellerName = req.body.sellerName;
  var goodsName = req.body.goodsName;
  var goodsPrice = req.body.goodsPrice;
  var originalPrice = req.body.originalPrice;
  var serverTime = req.body.serverTime;
  var category = req.body.category;
  var sort = req.body.sort;
  var goodsDesc = req.body.goodsDesc;

  var content = "<h3>商户ID: " + sellerID + "</h3>" +
    "<h3>商户名: " + sellerName + "</h3>" +
    "<h3>商品名: " + goodsName + "</h3>" +
    "<h3>商品价格: " + goodsPrice + "</h3>" +
    "<h3>商品原价: " + originalPrice + "</h3>" +
    "<h3>服务时长: " + serverTime + "</h3>" +
    "<h3>商品分类: " + category + "</h3>" +
    "<h3>商品排序值: " + sort + "</h3>" +
    "<h3>商品简介: " + goodsDesc + "</h3>";
  /*var content = "<h3>" + sellerID + "</h3>" + "<h3>" + sellerName + "</h3>";*/
  var mailOptions = {
    from: "yuankui@mykar.com", // 发件地址
    to: "345742108@qq.com", // 收件列表
    subject: "Hello world", // 标题
    html: content // html 内容
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
/*      res.writeHeader(200, {
        'Content-Type': 'text/javascript;charset=UTF-8'
      });*/
      res.write(JSON.stringify({
        status: 0,
        msg: "邮件发送失败",
        info: error
      }))
    } else {
      db.query(
        "INSERT INTO eamil_history (content) " +
        "VALUES(?)",
        JSON.stringify([content]),
        function (err) {
          if (err) {

            throw err;
            return;
          }
        }
      );

      res.writeHeader(200, {
        'Content-Type': 'text/javascript;charset=UTF-8'
      });
      res.write(JSON.stringify({
        status: 1,
        msg: "邮件发送成功"
      }))
      res.end();
      console.log(response.message);
    }

    smtpTransport.close(); // 如果没用，关闭连接池
    db.end(function () {
      console.log("mysql close");
    });
  });

});

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.listen(3000);