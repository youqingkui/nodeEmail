var http =  require('http')
var iconv = require('iconv-lite');
var url = 'http://car.autohome.com.cn/price/brand-35.html';
//假设我们抓取的是 GBK 编码的内容，这时候就需要转码了
http.get(url, function(res){
    res.setEncoding('UTF-8');
    var source = "";
    res.on('data', function(data) {
        source += data;
    });
    res.on('end', function() {
        var buf = new Buffer(source, 'UTF-8');
        var str = iconv.decode(buf, 'UTF-8');
        console.log(str);
        //这里输出的内容就不会有乱码了
    }).on("error", function() {
        logger.error('获取数据出现错误');
    });
});
