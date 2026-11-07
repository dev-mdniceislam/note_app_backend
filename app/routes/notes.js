const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth); // shob route e login lagbe

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Note id valid na' });
  next();
};

// CREATE  POST /api/notes
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !title.trim())
      return res.status(400).json({ message: 'Title dite hobe' });

    const note = await Note.create({ user: req.user._id, title, content });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// READ ALL  GET /api/notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// READ ONE  GET /api/notes/:id
router.get('/:id', validId, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note paoa jayni' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// UPDATE  PUT /api/notes/:id
router.put('/:id', validId, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const update = {};
    if (title !== undefined) {
      if (!title.trim())
        return res.status(400).json({ message: 'Title khali hote pare na' });
      update.title = title;
    }
    if (content !== undefined) update.content = content;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: 'Note paoa jayni' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// DELETE  DELETE /api/notes/:id
router.delete('/:id', validId, async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note paoa jayni' });
    res.json({ message: 'Note delete hoyeche' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
