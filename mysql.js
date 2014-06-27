var http=require('http');
var fs=require('fs');
var qs=require('querystring');
var mysql=require('mysql');

//1.服务
var server=http.createServer(function (request, response){
    var str='';

request.addListener('data', function (data){
    str+=data;
});
request.addListener('end', function (){
    var post=qs.parse(str);

    if(request.url.indexOf('?')!=-1)
    {
        var arr=request.url.split('?');

        var url=arr[0];
        var get=qs.parse(arr[1]);
        console.log(get);
        console.log(get.act);
    }
    else
    {
        var url=request.url;
        var get={};
    }

    if(url=='/user')
    {
        console.log(get.act);
        switch(get.act)
        {
            case 'add':
                var db=mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'test'});

                db.query("SELECT * FROM user_table WHERE username='"+get.user+"'", function (err, data){
                    if(err)
                    {
                        response.writeHeader(200,{'Content-Type':'text/javascript;charset=UTF-8'})
                        response.write('{err: 1, msg: "数据库出错"}');
                        response.end();
                    }
                    else
                    {
                        if(data.length>0)
                        {
                            response.write('{err: 1, msg: "用户名已存在"}');
                            response.end();
                        }
                        else
                        {
                            db.query("INSERT INTO user_table VALUES('"+get.user+"', '"+get.pass+"')", function (err, data){
                                if(err)
                                {
                                    response.write('{err: 1, msg: "数据库出错"}');
                                    response.end();
                                }
                                else
                                {
                                    response.write('{err: 0, msg: "注册成功"}');
                                    response.end();
                                }
                            });
                        }
                    }
                });
                break;
            case 'login':
                //1.连接
                var db=mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'test'});

                db.query("SELECT * FROM user_table WHERE username='"+get.user+"'", function (err, data){
                    if(err)
                    {
                        response.write('{err: 1, msg: "数据库出错"}');
                        response.end();
                    }
                    else
                    {
                        if(data.length==0)
                        {
                            response.write('{err: 1, msg: "此用户名不存在"}');
                            response.end();
                        }
                        else
                        {
                            if(data[0].password==get.pass)
                            {
                                response.write('{err: 0, msg: "登录成功"}');
                                response.end();
                            }
                            else
                            {
                                response.write('{err: 1, msg: "用户名或密码有误"}');
                                response.end();
                            }
                        }
                    }
                });
                break;
        }
    }
    else
    {
        fs.readFile('www'+url, function (err, data){
            if(err)
            {
                response.write('404');
            }
            else
            {
                response.write(data);
            }
            response.end();
        });
    }
});
});
server.listen(8080);