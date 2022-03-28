router.get('/check', function (req, res) {
    var request = http.request({
        host: 'localhost',
        port: 3000,
        path: '/test',
        method: 'GET',
        headers: {
            // headers such as "Cookie" can be extracted from req object and sent to /test
        }
    }, function (response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            res.end('check result: ' + data);
        });
    });
    request.end();
});