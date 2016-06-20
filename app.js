const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const querystring = require('querystring');

var cache = {}; //存放已经访问过的文件缓存
var server = http.createServer(function(request, response) {
    var filePath = './',
        requestUrl = request.url;
    if (requestUrl === '/') {
        filePath = './public/index.html';
    } else {
        filePath = './public' + requestUrl;
    }
    serveStatic(response, cache, filePath);
});
server.listen(3000, function() {
    console.info('starting server...');
});

//发送静态文件
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        redirectTo_404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                redirectTo_404(response);
            }
        });
    }
}

//发送文件
function sendFile(response, absPath, content) {
    var basename = path.basename(absPath);
    response.writeHead(200, {
        'Content-Type': mime.lookup(basename)
    });
    response.end(content);
}
//处理404 错误
function redirectTo_404(response) {
    var absPath = './public/404.html';
    fs.readFile(absPath, function(err, data) {
        if (err) {
            sendErrorCode(response,404);
        } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
        }
    });
}
//发送错误码
function sendErrorCode(response, code) {
    response.writeHead(code, {
        'Content-Type': 'text/plan'
    });
    response.write('<h1>' + code + '</h1>');
    response.end();
}
