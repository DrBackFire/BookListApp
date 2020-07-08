const http = require('http');
const path = require('path');
const fs = require('fs');

// Creating a Sever, always has a request and a response.
const server = http.createServer((req, res) => {
  // Lead/Path to files
  let publicPath = path.join(
    __dirname, // Name of the directory
    'public', // File name
    req.url === '/' ? 'index.html' : req.url
    /* Checking if the url given is === / then load index,
     else load whatever the given url is. */
  );

  // Getting the file extension
  let fileExt = path.extname(publicPath);

  // Initial Content Type for the files
  let contentType = 'text/html';

  // Creating a Switch statement to check and set different content types
  switch (fileExt) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/ping';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read File
  fs.readFile(publicPath, (err, content) => {
    // Checking for different type of errors
    if (err) {
      if (err.code == 'ENOENT') {
        // Meaning URL/page entered NOT Found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            // Writing to the head of 404.html
            res.writeHead(404, { 'Content-Type': 'text/html' });
            // Setting the endpoint and displaying the page content
            res.end(content, 'utf8');
          }
        );
      } else {
        // Some Other err
        res.writeHead(500);
        // Displaying the err and making it dynamic
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Now displaying what the user typed
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
