var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var morgan = require('morgan')
var compression = require('compression')
var helmet = require('helmet')
var proxy = require('express-http-proxy');

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

app.use(proxy(elasticUrl, {
  limit: '100mb',
  parseReqBody: false,
  filter: function (req, res) {
    const authHeader = req.get('Authorization');

    if (authHeader == null || authHeader !== apiKey) {
      console.log("Got a authenticated request");
      return false;
    }
    console.log("Not authenticated");
    return true;
  }
}));

app.use('/probe',function (req, res) {
  res.send('Hello World!')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port)
