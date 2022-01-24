const router = require('express').Router();

const noteData = require('../db/notesdata');


router.get('/notes', function (req, res) {
    noteData
        .getNotes()
        .then(notes => res.json(notes))
        .catch(err => res.status(500).json(err));
});


router.post('/notes', (req, res) => {
    noteData
        .addNote(req.body)
        .then((note) => res.json(note))
        .catch(err => res.status(500).json(err));
});


router.delete('/notes/:id', function (req, res) {
    noteData
        .deleteNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch(err => res.status(500).json(err));
});


module.exports = router;