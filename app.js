const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.port;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./model/index');
const User = require('./model/registerSchema');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

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
app.use('/',userRoutes);
app.use('/',blogRoutes);

app.listen(port,()=>{
    console.log('server is running on port - ', port);
})