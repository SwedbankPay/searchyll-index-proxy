var Express = require('express');
var router = Express.Router();
var asyncHandler = require('express-async-handler');
const http = require('http');

const apiKey = process.env.apiKey || "development";
const elasticUrl = process.env.elasticHost || 'http://localhost'
const elasticPort = process.env.elasticPort || '9200'

router.all('*', asyncHandler(async (oreq, ores, next) => {
  const authHeader = oreq.get('Authorization');

  if (authHeader == null || authHeader !== apiKey && req.app.get('env') !== 'development') {
    next(createError(401));
  }

  let options = {
    host: elasticUrl,
    port: elasticPort,
    path: oreq.path,
    method: oreq.method
  }
  if (oreq.body != null)
    options.body = oreq.body;

  const creq = http
    .request(options, pres => {
      // set encoding
      pres.setEncoding('utf8');

      // set http status code based on proxied response
      ores.writeHead(pres.statusCode);

      // wait for data
      pres.on('data', chunk => {
        ores.write(chunk);
      });

      pres.on('close', () => {
        // closed, let's end client request as well
        ores.end();
      });

      pres.on('end', () => {
        // finished, let's finish client request as well
        ores.end();
      });
    })
    .on('error', e => {
      // we got an error
      console.log(e.message);
      try {
        // attempt to set error message and http status
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
        // ignore
      }
      ores.end();
    });

  creq.end();
}));





app.post('/api/BLABLA', (oreq, ores) => {
  const options = {
    // host to forward to
    host: 'www.google.com',
    // port to forward to
    port: 80,
    // path to forward to
    path: '/api/BLABLA',
    // request method
    method: 'POST',
    // headers to send
    headers: oreq.headers,
  };

  const creq = http
    .request(options, pres => {
      // set encoding
      pres.setEncoding('utf8');

      // set http status code based on proxied response
      ores.writeHead(pres.statusCode);

      // wait for data
      pres.on('data', chunk => {
        ores.write(chunk);
      });

      pres.on('close', () => {
        // closed, let's end client request as well
        ores.end();
      });

      pres.on('end', () => {
        // finished, let's finish client request as well
        ores.end();
      });
    })
    .on('error', e => {
      // we got an error
      console.log(e.message);
      try {
        // attempt to set error message and http status
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
        // ignore
      }
      ores.end();
    });

  creq.end();
});