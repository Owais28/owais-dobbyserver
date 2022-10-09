var createError = require('http-errors');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// var api = require('./routes/api/main');
// var app = express();
var cors = require('cors')
// var bodyParser = require('body-parser')
// var multer = require('multer')
// // var GridFsStorage = require('multer-gridfs-storage');
// // var Grid = require('gridfs-stream');
// // var methodOverride = require('method-override');
var imgModel = require('./models/Image')
// var fs = require('fs');
// // var uplaod = require('./middleware/upload')
// // const GridFSBucket = require("mongodb").GridFSBucket;
// // const uploadController = require("./controllers/upload");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/temp/images')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.originalname + '-' + uniqueSuffix)
//   }
// })

// var uplaod = multer({ storage : storage })
// // view engine setup
// // app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'ejs');




// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


// // let gfs;
// // db.once("open", function () {
// //   gfs = new mongoose.mongo.GridFSBucket(
// //     db.db,
// //     {
// //       bucketName: 'image'
// //     }
// //   )
// // });

// app.post('/login', uplaod.single('image'), (req, res) => {
//   console.log(req.body);
//   const newmage = new imgModel(
//     {
//       title: req.body.title,
//       img: {
//         data: fs.readFileSync(path.join(__dirname + '/temp/images' + req.file.filename)),
//         contentType: 'image/png'
//       },
//       author: req.body.author
//     }
//   )
//   // newmage.save().then(
//   //   image => {
//   //     res.status(200).json(
//   //       {
//   //         success: true,
//   //         image
//   //       }
//   //     )
//   //   }
//   // ).catch(
//   //   err =>
//   //     res.status(500).json(err)

//   // )

//   // console.log(req.body.file)
//   // res.json(
//   //   {
//   //     message : req.body
//   //   }
//   //   )


//   imgModel.create(obj, (err, item) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       // item.save();
//       res.redirect('/');
//     }
//   });
//   res.json(
//     {
//       message: "Successful!"
//     }
//   )
// })

// // app.post('/login', uploadController.uploadFiles)

// // app.use('/api', api)

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json({
//     message:
//       "error"
//   });
// });


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
  }
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      item.save();
      // res.redirect('/');
    }
  });

  console.log(obj)
  res.json({
    message: "Suxce",
    file: req.file
  })
});

// app.post('/signup')


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


app.listen(8080, () => {
  console.log("Server started!");
})