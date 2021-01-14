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

let port = process.env.PORT || 3001;

app.use(helmet());
app.use(compression())
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

const apiKey = process.env.apiKey || "super-secret-key";
const elasticUrl = process.env.elasticHost || 'localhost:9200'

app.use('/', proxy(elasticUrl, {
  limit: '100mb',
  parseReqBody: false,
  filter: function (req, res) {
    const authHeader = req.get('Authorization');

    if (authHeader == null || authHeader !== apiKey) {
      console.log("Got a not authenticated request");
      return false;
    }
    console.log("Request authenticated");
    return true;
  }
}));

app.use('/probe',function (req, res) {
  console.log("Got a probe");
  console.log(process.env);
  res.send(elasticUrl);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  console.log(elasticUrl);
  console.warn(process.env);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

app.listen(port)
