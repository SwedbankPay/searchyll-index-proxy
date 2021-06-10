var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var morgan = require('morgan')
var compression = require('compression')
var helmet = require('helmet')
var proxy = require('express-http-proxy');
var process = require('process');

var app = express();

app.use(helmet());
app.use(compression())
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

const apiKey = process.env.API_KEY || "super-secret-key";
const elasticUrl = process.env.ELASTICSEARCH_HOSTS || 'localhost:9200'
const elasticAuth = process.env.ELASTICSEARCH_AUTH || 'none'

app.use('/', proxy(elasticUrl, {
  limit: '100mb',
  parseReqBody: false,
  filter: function (req, res) {
    const authHeader = req.get('Authorization');

    if (authHeader == null || authHeader !== apiKey) {
      return false;
    }
    return true;
  },
  proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
    // create a buffer
    const buff = Buffer.from(elasticAuth, 'utf-8');

    // decode buffer as Base64
    const base64 = buff.toString('base64');
    proxyReqOpts.headers['authorization'] = "Basic " + base64;
    return proxyReqOpts;
  },
}));

app.use('/probe',function (req, res) {
  res.send('Hello World!');
});

app.get('/',function (req, res) {
  res.send('Hello World!');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
