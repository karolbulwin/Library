const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const sassMiddleware = require('node-sass-middleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(morgan('dev'));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/'),
  dest: path.join(__dirname, 'public/'),
  debug: true,
  outputStyle: 'compressed',
  indentedSyntax: false,
  sourceMap: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
    secret: 'library',
    resave: false,
    saveUninitialized: false
  }
));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/popper.js/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/books/myBooks', title: 'My Books' },
  { link: '/auth/logout', title: 'Logout' }

];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);
const searchRouter = require('./src/routes/searchRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/search', searchRouter);

app.get('/', (req, res) => {
  if (req.user) {
    res.render(
      'indexLogout',
      {
        nav,
        title: 'Library'
      }
    );
  } else {
    res.render(
      'index',
      {
        nav,
        title: 'Library'
      }
    );
  }
});

app.listen(port, () => {
  debug(`listening on ${chalk.green(port)}`);
});
