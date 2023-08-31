const http = require('http');
const homePage = require('./home')

const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
    });
    
    res.write(homePage);
    res.end();
});

server.listen(5000,()=> console.log('Server is listening on port 5000'))
