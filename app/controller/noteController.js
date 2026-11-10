// app/controller/noteController.js
const Note = require('../models/Note');
const catchAsync = require('../middleware/catchAsync');

// POST /api/notes
exports.createNote = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({
    title,
    content,
    user: req.user.id,
  });

  res.success(201, 'Note created', note);
});

// GET /api/notes
exports.getNotes = catchAsync(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });

  res.success(200, 'Notes fetched', notes);
});

// GET /api/notes/:id
exports.getNote = catchAsync(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

  if (!note) return res.error(404, 'Note not found');

  res.success(200, 'Note fetched', note);
});

// PUT /api/notes/:id
exports.updateNote = catchAsync(async (req, res) => {
  const allowed = {};
  if (req.body.title !== undefined) allowed.title = req.body.title;
  if (req.body.content !== undefined) allowed.content = req.body.content;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: allowed },
    { new: true, runValidators: true },
  );

  if (!note) return res.error(404, 'Note not found');

  res.success(200, 'Note updated', note);
});

// DELETE /api/notes/:id
exports.deleteNote = catchAsync(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!note) return res.error(404, 'Note not found');

  res.success(200, 'Note deleted', null);
});
