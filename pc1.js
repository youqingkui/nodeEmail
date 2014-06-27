var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var http = require('http');

var url = "http://car.autohome.com.cn/price/brand-1.html";

http.get(url, function(res){
  res.setEncoding('binary');
  var chunk = "";
  res.on('data', function(data){
    chunk += data; 
  });
  
  res.on('end', function(){
    var buf = new Buffer(chunk, 'binary');
    var str = iconv.decode(buf, 'GBK');
    var $ = cheerio.load(str);
    var data = {};
    //var brand = $(".list-dl > dt a").text();
    var brand2 = $(".uibox-title > h2 a").text();
    console.log(brand2);
    $(".tab-content-item > div").each(function(){
      if($(this).attr("data-value")){
        var dataValue = $(this).attr("data-value");
        var cx = $(this).find('a[class=font-bold]').text();
        //console.log(cx);
        var czID = '#divSpecList' + dataValue;
        var tmp = [];
        console.log(cx);
        $(czID).find('p[class=infor-title]').children('a').first().each(function(){
          var carName = $(this).text();
          tmp.push(carName);
          data[cx] = tmp;
          //console.log(data);
          //console.log($(this).text()); 
        });
        //console.log("```````");
        
      }
    });
    console.log(data);
    
  })
 
});
