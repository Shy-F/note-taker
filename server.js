const express = require('express');
const path = require('path');
const notesData = require('./db/notesdata');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(_dirname, 'notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    notesData
        .getNotes().then(notes => res.json(notes)).catch(err => res.status(500).json(err));
});

app.post('/notes', (req, res) => {
    notesData
    .addNote(req.body).then((note) => res.json(note)).catch(err => res.status(500).json(err));
});

app.delete('/notes/:id', (req, res) => {
    notesData
    .deleteNote(req.params.id).then(() => res.json({ ok: true })).catch(err => res.status(500).json(err));
});

app.listen(PORT, () => {
    console.log(`API server is ready on port ${PORT}!`);
});

module.exports = app;