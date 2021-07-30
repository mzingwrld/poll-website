const { Router } = require('express');
const Poll = require('../models/Polls');
const Answer = require('../models/Answers');
const auth = require('../middleware/auth.middleware');
const { check, validationResult } = require('express-validator');
const router = Router();


/**
 * Creates poll
 * /api/poll/create ENDPOINT
 */
router.post(
  '/create',
  auth,
  [
    check('subject', 'Subject field should contain at least 3 characters and maximum 100 characters.').isLength({ min: 3, max: 256 }),
    check('options', 'Options field should be an array.').isArray(),
    check('options.*', 'Options array should have only string values.').isString(),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Unable to create a poll. Some data is invalid.',
      });
    }

    const { subject, options } = req.body;

    const poll  = new Poll({
      subject, options, user_id: req.user.userId,
    });

    await poll.save();

    res.status(200).json({ data: { id: poll.id }, message: 'Successfuly created' });
  } catch (e) {
    res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' });
  }
});

/**
 * /api/poll/view/:id ENDPOINT
 * Sends poll subject and options \
 * and answers to this polls that were made by users
 */
router.get('/view/:id', auth, async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.id);
      const answers = await Answer.find({ poll_id: poll.id });
      if (poll && answers) {
        res.status(200).json({ data: { poll, answers }, message: 'Success' });
        return;
      }

      res.status(404).json({ data: null, message: 'Not found' });
    } catch (e) {
      res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' })
    }
});

/**
 * Save vote result from user
 * /api/poll/vote ENDPOINT
 */
router.post(
  '/vote',
  auth,
  [
    check('poll_id', 'Poll identifier should not be empty.').notEmpty(),
    check('poll_id', 'Poll identifier should be a string.').isString(),
    check('answer', 'Answer should not be empty.').notEmpty(),
    check('answer', 'Answer should represent a number.').isInt(),
    check('name', 'Name field should contain at least 1 characters and maximum 100 characters.').isLength({ min: 1, max: 100 }),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Unable to vote. Some data is invalid.',
      });
    };

    const { poll_id, answer: option, name } = req.body;
    const { userId } = req.user;
    const poll = await Poll.findById(poll_id);
    /**
     * user can answer only once for one poll
     */
    const isUserAnsweredYet = await Answer.findOne({ poll_id: poll.id, user_id: userId });
    /**
     * Are we received an existing option for a poll?
     */
    const isAnswerExist = poll.options.length > option;

    if (!poll) {
      res.status(400).json({ data: null, message: `Unable to find poll with id ${poll_id}` });
      return;
    }

    if (isUserAnsweredYet) {
      res.status(400).json({ data: null, message: `You already answered to this poll` });
      return;
    }

    if (!isAnswerExist) {
      res.status(400).json({ data: null, message: `Unable to find answer with index ${option} for a poll with id ${poll_id}` });
      return;
    }


    const answer  = new Answer({
      poll_id, user_id: userId, name, answer: option
    });

    await answer.save();
    res.status(200).json({ data: { answer }, message: 'Successfuly created' });
    req.app.io.emit('poll-updated', { poll_id });
  } catch (e) {
    console.log(e)
    res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' });
  }
});

/**
 * View polls created by a user
 * /api/poll/list ENDPOINT
 */
router.get(
  '/list',
  auth,
  async (req, res) => {
  try {
    const { userId } = req.user;
    const polls = await Poll.find({ user_id : userId });
    res.status(200).json({ data: polls, message: 'Success.' });
  } catch (e) {
    res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' });
  }
});

/**
 * View poll answers
 * /api/poll/answers/:poll_id ENDPOINT
 */
 router.get(
  '/answers/:poll_id',
  auth,
  async (req, res) => {
    try {
      const answers = await Answer.find({ poll_id: req.params.poll_id });
      if (answers) {
        res.status(200).json({ data: { answers }, message: 'Success' });
        return;
      }

      res.status(404).json({ data: null, message: 'Not found' });
    } catch (e) {
      console.log(e)
      res.status(500).json({ data: null, message: 'Something went wrong. Please try again..' })
    }
});

module.exports = router;