var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User_Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true
        },
        username : {
            type : String,
            required : true
        },
        email: {
            type: String,
            unique: [true, "email already exists in database!"],
            lowercase: true,
            trim: true,
            required: [true, "email not provided"],
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: '{VALUE} is not a valid email!'
            }

        },
        password: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        images : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Image'
        }
        ]
    }
)

module.exports = new mongoose.model('users', User_Schema);