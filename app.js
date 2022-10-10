var createError = require('http-errors');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var cors = require('cors')
// var bodyParser = require('body-parser')
// var multer = require('multer')
// // var GridFsStorage = require('multer-gridfs-storage');
// // var Grid = require('gridfs-stream');
// // var methodOverride = require('method-override');
var imgModel = require('./models/Image')

// module.exports = app;

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var multer = require('multer')

var fs = require('fs');
var path = require('path');
const { signup } = require('./controllers/signUp');
const { signin } = require('./controllers/signIn');
// const tokenVerify = require('./controllers/tokenVerify');
const verifyToken = require('./controllers/tokenVerify');
const Image = require('./models/Image');
require('dotenv/config');

//Set up default mongoose connection
var mongoDB = process.env.DATABASE_URI;
const connect = mongoose.connect(mongoDB, { useNewUrlParser: true }).then(
  (res) => console.log("Database connnected Successfully!")
).catch(
  (err) => {
    console.log("Connection Error ", err)
  }
);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/temp/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now())
  }
});


var upload = multer({ storage: storage });
app.get('/', (req, res) => {
  res.status(200).json({
    message: "home",
  }
  )
})
app.get("/dashboard", verifyToken, function (req, res) {
  if (!user) {
    res.status(403)
      .send({
        message: "Invalid JWT token"
      });
  }
  if (req.user == "admin") {
    res.status(200)
      .send({
        message: "Congratulations! but there is no hidden content"
      });
  } else {
    res.status(403)
      .send({
        message: "Unauthorised access"
      });
  }
});
app.post('/register', signup)
app.post('/login', signin)


app.post('/upload', upload.single('image'), (req, res, next) => {
  console.log(req.body)
  console.log(req.file)
  const obj = {
    title: req.body.title,
    img: {
      data: fs.readFileSync(path.resolve(__dirname + '/temp/images/' + req.file.filename)),
      contentType: req.file.mimetype
    },
    author: req.body.id
  }

  imgModel.create(obj, (err, item) => {
    if (err) {
      res.json(
        {
          message: err
        }
      )
      console.log(err)
    }
    else {
      item.save();
      res.status(200).json(
        {
          message: 'success!'
        }
      )
      // res.redirect('/');
    }
  });

});

// get all images by author id
app.get('/images/:id', (req, res) => {
  try {
    Image.find({ author: req.params.id }, (err, images) => {
      res.status(200).json({
        message: "success!",
        images
      })
    })
  } catch (error) {

  }
})

// get all images by user's search query
app.post('/search', async (req, res) => {
  try {
    console.log(req.body)
    await Image.find({
      title: new RegExp(req.query.query, 'i'),
      author: req.body.author
    }, (err, images) => {
      res.status(200).json({
        message: "success!",
        images
      })
    })
  } catch (error) {
  }
})

// // catch 404 and forward to error handler
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
  res.json({
    message:
      "error"
  });
});



app.listen(process.env.PORT, () => {
  console.log("Server started!");
})