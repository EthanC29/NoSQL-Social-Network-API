const { Schema, model } = require('mongoose');
const ThoughtSchema = require('./Thought');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: 'Username is Required'
    },

    email: {
      type: String,
      unique: true,
      required: 'Username is Required',
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Invalid Email']
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },

  {
    toJSON: {
      virtuals: true
    },
    id: false,
  }
);

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;