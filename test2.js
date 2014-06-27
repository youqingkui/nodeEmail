var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
http = require('http');
var server = http.createServer(function (req, res) {
  request("http://car.autohome.com.cn/price/brand-35.html", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
/*      $('.main-title a').each(function () {
        console.log('%s (%s)', $(this).text(), $(this).attr('href'));
      });
      $('.tab-content-item').each(function () {
        console.log('%s (%s)', $(this).text(), $(this).attr('href'));
      });*/
      $('.tab-content-item > div').each(function () {
        if ($(this).attr('data-value')) {
          var dataValue = $(this).attr('data-value');
          var cx = $(this).find('a[class=font-bold]').text();
          var buf = new Buffer(cx, 'binary');
          var str = iconv.decode(cx, 'GBK');
/*          console.log(str);
          console.log(cx);*/
          console.log('%s', $(this).attr('data-value'));
          res.writeHeader(200,{'Content-Type':'text/javascript;charset=UTF-8'});
          res.end(cx);
        }
      });
    }
/*    res.writeHeader(200,{'Content-Type':'text/javascript;charset=GB2312'});
    res.end(cx);*/
  });

});

server.listen(3000);
