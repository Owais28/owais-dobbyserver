const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require('crypto');
const path = require("path");
require('dotenv').config()

var storage = new GridFsStorage({
  url: process.env.DATABASE_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    return new Promise((res, rej) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return rej(err)
        }
        const filename = buff.toString('hex') + path.extname(file.originalname) + Date.now().toString()
        const fileIno = {
          filename: filename,
          bucketName: 'image'
        }
        res(fileIno)
      })
    })
  }
});

module.exports = multer({storage})



