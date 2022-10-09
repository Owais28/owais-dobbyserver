var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Image_Schema = new Schema(
    {
        title: {
            type: String,
        },
        img:
        {
            data: Buffer,
            contentType: String
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

module.exports = new mongoose.model('Image', Image_Schema)