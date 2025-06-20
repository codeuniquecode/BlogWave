const express = require('express');
const app = express();
require('dotenv').config();
const passport = require('passport');
require('./config/passportConfig')(passport);
const port = process.env.port;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
app.use(methodOverride('_method'));
const flash = require('connect-flash');
require('./model/index');
const User = require('./model/registerSchema');
const {Server} = require('socket.io')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
const multer = require('./middleware/multerConfig').multer;
const storage = require('./middleware/multerConfig').storage;
const upload = multer({storage:storage});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Set the views directory
app.use(express.static('./public/'));
app.use(express.static('./storage/'));
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const authRoutes = require('./routes/oauthRoutes'); // adjust path
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    message: 'Too many attempts, please try again after 2 minutes'
  });
  const passwordLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    message: 'Too many attempts, please try again after 2 minutes'
  });
app.use('/verifyOtp',limiter);

app.use('/forgotPassword',passwordLimiter);
app.use('/',userRoutes);
app.use('/',blogRoutes);
app.use('/',passwordRoutes);
app.use('/',authRoutes);
app.use('/',adminRoutes);
app.get('/loaderio-910651ac44446c8cdefd998e229a9c87/', (req, res) => {
  res.send('loaderio-910651ac44446c8cdefd998e229a9c87');
});

const server = app.listen(port,()=>{
    console.log('server is running on port - ', port);
})

const io = new Server(server);
// console.log(io);
// return;
module.exports = io;
require('./controller/chatController')