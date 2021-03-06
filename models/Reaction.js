const { Schema, model } = require('mongoose');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },

    reactionBody: {
      type: String,
      required: 'Text is Required',
      maxLength: 280
    },

    username: {
      type: String,
      required: 'Username is Required'
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
  }
);

module.exports = ReactionSchema;