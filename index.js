const http = require('http');
const url = require('url')
const port = process.env.PORT || 8000
var StringDecoder = require('string_decoder').StringDecoder;

http.createServer(function (req, res) {

    //  Get Url and parse it
    //  true parameters for parse query string also
    const parseUrl = url.parse(req.url, true)

    //  GET PATH
    const path = parseUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    if (trimmedPath === "test") {
        // Get the payload,if any
        var decoder = new StringDecoder('utf-8');
        var buffer = '';
        req.on('data', function (data) {
            buffer += decoder.write(data);
        });
        req.on('end', function () {
            buffer += decoder.end();

            // Log the request/response
            console.log('Request payload: ', buffer);
            let obj = JSON.parse(buffer)

            if (obj.metadata.type === 'http-req') {
               
                let request = http.get(obj.metadata.call, (result) => {

                    console.log(`STATUS: ${result.statusCode}`);
                    result.setEncoding('utf8');
                    let data = ''
                    result.on('data', (chunk) => {
                        data += chunk
                        console.log(`BODY: ${chunk}`);
                    });
                    result.on('end', () => {
                        console.log('No more data in response.');
                        res.writeHead(result.statusCode)
                        res.write(data)
                        res.end()
                    });

                })

                request.on('error', (e) => {
                    console.error(`problem with request: ${e.message}`);
                    res.writeHead(500)
                    res.write(e.message)
                    res.end()
                })
            }

        });
    } else if (trimmedPath === "error") {
        console.log("Some Error")
        res.writeHead(500)
        res.write("Some Error Occured")
        res.end()
    } else {
        res.writeHead(404)
        res.write("Not Found")
        res.end()
    }





}).listen(port, function () {
    console.log("server start at port 8000"); //the server object listens on port 3000
});