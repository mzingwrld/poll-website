const { Schema, model } = require('mongoose');

/**
 * Poll
 */
const schema = new Schema({
  subject: { type: String, required: true, ref: 'Polls' },
  options: { type: [String], required: true, },
  user_id: { type: String, required: true, ref: 'User' },
});

module.exports = model('Polls', schema);