

 if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var methodOverride = require('method-override')

var indexRouter = require('./routes/index');
var authorsRouter = require('./routes/authorsRoutes');
var booksRouter = require('./routes/booksRoutes');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect(process.env.DATABASE_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', error => console.error(error))
db.on('open', () => console.error("connected to Mongoose"))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'))
app.use(express.static('public'))

//Nếu chưa có body-parser thì tải về bằng câu lệnh: 'npm install body-parser' nhé
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');


app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize()); //Dòng này để thông báo sử dụng passport nhé
app.use(passport.session()); //Dòng này để thông báo sử dụng passport nhé
app.use(cookieParser('asdf33g4w4hghjkuil8saef345'));

//nếu chưa tải về thì tải gói session với lệnh
//và khai báo sử dụng:
app.use(session({
    secret: 'asdf33g4w4hghjkuil8saef345',
    cookie: {
	    httpOnly: true,
	    expirmaxAgees: 1000 * 50 * 5 // use expires instead of maxAge
    },
  
    // cookie: {
    //     maxAge: 1000 * 50 * 5 //đơn vị là milisecond
    // },
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
passport.use(new localStrategy(
  (username, password, done) => { //các tên - name trường cần nhập, đủ tên trường thì Done 
      if(username == 'user2') { //kiểm tra giá trị trường có name là username
          if (password == 12345) { // kiểm tra giá trị trường có name là password
              return done(null, username); //trả về username
          } else {
              return done(null, false); // chứng thực lỗi
          }
      } else {
          return done(null, false); //chứng thực lỗi
      }
  }
))
passport.serializeUser((username, done) => {
  done(null, username);
})
passport.deserializeUser((username, done) => {
  //tại đây hứng dữ liệu để đối chiếu
  if (username == 'user2') { //tìm xem có dữ liệu trong kho đối chiếu không
      return done(null, name)
  } else {
      return done(null, false)
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // console.log(req.session);
  // console.log(req.user);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);
app.route('/login')
.get((req, res) => res.render('login'))
.post(passport.authenticate('local', { //chọn phương thức check là local => npm install passport-local
  failureRedirect: '/login',  //nếu check không đúng thì redirect về link này
  successRedirect: '/loginOK'
}));
app.get('/loginOK', (req, res) => res.send('Thành công'));

app.get('/secret', (req, res) => {
  if (req.isAuthenticated()) { //trả về true nếu đã đăng nhập rồi
    res.send('Đã đăng nhập');
  } else {
      res.send(req.isAuthenticated());
      //res.redirect('/login');
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
