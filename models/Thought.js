const { Schema, model } = require('mongoose');
const ReactionSchema = require('./Reaction');

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'Text is Required',
      maxLength: 280
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    username: {
      type: String,
      required: 'Username is Required'
    },

    reactions: [ReactionSchema]
  },

  {
    toJSON: {
      virtuals: true
    },
    id: false,
  }
);

UserSchema.virtual("reactCount").get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;