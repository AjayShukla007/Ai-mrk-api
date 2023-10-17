const express = require("express");

const { body, validationResult } = require("express-validator");

const router = express.Router();
router.use(express.json());
const Notes = require("../models/Notes");
const fetchData = require("../middleware/getUser");

//NOTES ROUTE 1:
//Getting notes api/notes/getNotes
router.get("/getNotes", fetchData, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//NOTES ROUTE 2:
//Creating Notes
router.post(
  "/addNotes",
  fetchData,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("note", "must be more then 5 charectors long").isLength({
      min: 5
    })
  ],
  async (req, res) => {
    try {
      const { title, note } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newNote = new Notes({
        title,
        note,
        user: req.user.id
      });
      const saveNote = await newNote.save();
      res.json(saveNote);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

// Delete a Note by ID
router.delete("/deleteNote/:id", fetchData, async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Notes.findByIdAndRemove(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note deleted successfully",
      deletedNote
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
