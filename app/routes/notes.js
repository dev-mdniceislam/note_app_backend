const express = require('express');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controller/noteController');
const { verifyToken, restrictTo } = require('../middleware/auth');

const router = express.Router();

// এই router এর সব route এ token + role check লাগবে
router.use(verifyToken, restrictTo('user', 'admin'));

router.route('/').post(createNote).get(getNotes);

router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
