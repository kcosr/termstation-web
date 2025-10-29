const http = require('http');
const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, 'docs');
const cnamePath = path.join(docsDir, 'CNAME');
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

const server = http.createServer((req, res) => {
  const rawPath = decodeURI(req.url.split('?')[0] || '/');
  let relativePath = rawPath.replace(/^\/+/, '');

  if (relativePath === '') {
    relativePath = 'index.html';
  }

  if (relativePath.endsWith('/')) {
    relativePath += 'index.html';
  }

  const normalizedPath = path.normalize(relativePath);

  if (normalizedPath.startsWith('..') || path.isAbsolute(normalizedPath)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  const resolvedPath = path.resolve(docsDir, normalizedPath);

  if (!resolvedPath.startsWith(docsDir)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  if (resolvedPath === cnamePath) {
    sendError(res, 404, 'Not Found');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        sendError(res, 404, 'Not Found');
      } else {
        sendError(res, 500, 'Internal Server Error');
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(resolvedPath, 'index.html');
      serveFile(indexPath, res);
    } else if (stats.isFile()) {
      serveFile(resolvedPath, res);
    } else {
      sendError(res, 404, 'Not Found');
    }
  });
});

function serveFile(filePath, res) {
  if (filePath === cnamePath) {
    sendError(res, 404, 'Not Found');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      sendError(res, 404, 'Not Found');
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    });
    stream.on('error', () => {
      sendError(res, 500, 'Internal Server Error');
    });
    stream.pipe(res);
  });
}

server.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
  console.log(`Serving static files from ${docsDir}`);
});
