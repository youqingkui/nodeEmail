var connect = require('connect');
var app = connect();
var nodemailer = require("nodemailer");
var http = require('http');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var userName = process.env.EMAIL_NAME
var password = process.env.EMAIL_PWD

var accessLog = fs.createWriteStream('access.log', {
  flags: 'a'
});
var errorLog = fs.createWriteStream('error.log', {
  flags: 'a'
});

var smtpTransport = nodemailer.createTransport("SMTP", {
  host: "smtp.exmail.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: userName, // 账号
    pass: password // 密码
  }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(logger({
  stream: accessLog
}));

/*console.log(process.env);
console.log(process.env.DATABASE);
console.log(process.env.HOST);
console.log('Current directory: ' + process.cwd());*/
app.use(function (req, res) {
  if (req.method == 'GET') {
    if (req.url == '/') {

      //res.send("love");
      res.writeHeader(200, {
        'Content-Type': 'text/javascript;charset=UTF-8'
      })
      //res.write(JSON.stringify({a:123}));
      res.end("ok");
    }
  }
  if (req.method == 'POST') {
    /*接受参数*/
    var subject  = req.body.subject;
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

    var mailOptions = {
      from: userName, // 发件地址
      to: "345742108@qq.com, wujie@mykar.com, lidan@mykar.com", // 收件列表
      subject: subject, // 标题
      html: content // html 内容
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        var sendContent = JSON.stringify({status:0, msg:'邮件发送失败', info:error});
        res.setHeader('Content-Length', Buffer.byteLength(sendContent));
        res.setHeader('Content-Type', 'text/javascript');
        res.end(sendContent);
        console.log(error);
      } else {
        var sendContent = JSON.stringify({status:1, msg:'邮件发送成功'});
        res.setHeader('Content-Length', Buffer.byteLength(sendContent));
        res.setHeader('Content-Type', 'text/javascript');
        res.end(sendContent);
        console.log("Message sent: " + response.message);
      }
      smtpTransport.close(); // 如果没用，关闭连接池
    });
  }
});

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.listen(3000);