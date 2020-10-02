var Express = require('express');
var router = Express.Router();
var asyncHandler = require('express-async-handler');
const http = require('http');

const apiKey = process.env.apiKey || "super-secret-key";
const elasticUrl = process.env.elasticHost || 'duckduckgo.com'


router.all('not_in_use_atm', asyncHandler(async (oreq, ores, next) => {
  console.log("Got a request")
  const authHeader = oreq.get('Authorization');

  if (authHeader == null || authHeader !== apiKey /* && req.app.get('env') !== 'development' */) {
    ores.status(401).end()
    return;
  }

  let options = {
    hostname: elasticUrl,
    path: oreq.path,
    method: oreq.method,
    family: 4
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
      pres.on('data', (chunk) => {
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
      console.log("Got an error")
      console.log(e.message);
      try {
        // attempt to set error message and http status
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
        console.log("Error writing to head")
        console.log(e.message)
        // ignore
      }
      ores.end();
    });

  creq.end();
  next();
}));

exports.proxyRouter = router;