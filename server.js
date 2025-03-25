const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if(filePath === './') filePath = './index.html';

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if(extname === '.js') contentType = 'text/javascript';

  fs.readFile(filePath, (err, content) => {
    if(err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
    });
    res.end(content);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running at http:/localhost:${PORT}`);
});