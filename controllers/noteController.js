const Note = require('../models/note.js');
var multer  = require('multer');
const ObjectId = require('mongodb').ObjectID;


module.exports.createNote = function (req, res) {
    if(!req.body) return res.status(400).json({type: 'error', text: 'Немає даних!'});
    let noteTitle = req.body.noteTitle;
    let noteDate = new Date();
    let noteText = req.body.noteText;

    let errorText = '';
    if( noteTitle === undefined || noteTitle.length <= 1 ) {
        errorText += 'Note title must contain more then 1 symbol | ';
    } else if( noteText === undefined || noteText.length <= 1 ) {
        errorText += 'Note text must contain more then 1 symbols.';
    }

    if(errorText.length > 0) {
        return res.status(400).json({type: 'error', text: errorText});
    }

    const newNote = new Note({
        title: noteTitle,
        date: noteDate,
        text: noteText,
        thumb: '/public/img/' + req.file.filename,
    });

    newNote.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({type: 'error', text: 'Щось пышло не так :('});
        }

        return res.status(201).json({type: 'success', text: 'Створено нову нотатку'});
    });
};

module.exports.getNotes = (req, res) => {

    Note.find({}).lean().exec((err, notes) => {
        if (err) {
            console.log(err);
            return res.status(500).json({type: 'error', text: 'Щось пышло не так :('});
        }

        notes.map((note) => {
            note.id = note._id;
            delete note._id;

            return note;
        });
        return res.status(200).json(notes);
    });
};

module.exports.getNote = (req, res) => {
    const id = req.params.id;

    Note.findById(id, function(err, note) {
        if (err) {
            console.log(err);
            return res.status(500).json({type: 'error', text: 'Щось пышло не так :('});
        }

        note.id = note._id;
        delete note._id;

        return res.status(200).json(note);
    });
};

module.exports.removeNote = (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        return res.status(400).json({type: 'error', text: 'Немаэ ID нотатки!'});
    }
    Note.remove({_id: noteId},function(err, doc){
        if (err) return res.status(500).send(err);

        if (doc.deletedCount === 0) {
            return res.status(400).json({type: 'error', text: 'Нотатка не видалена! Її не існує в базі!'});
        }

        return res.status(200).json({type: 'success', text: 'Нотатка із ID - {' + req.params.id + '} була видалена!'});
    });
};

module.exports.editNote = (req, res) => {
    if(!req.body) return res.status(400).json({type: 'error', text: 'There is no data'});
    let noteTitle = req.body.noteTitle;
    let noteDate = new Date();
    let noteText = req.body.noteText;

    let update = {title: noteTitle, text: noteText, date: noteDate};

    if(req.file) {
        update.thumb = '/public/img/' + req.file.filename;
    }

    Note.updateOne({'_id': ObjectId(req.params.id)}, {$set: update}, (err) => {
         if (err) return res.status(500).send({type: 'success', text: err});

        return res.status(200).json({type: 'success', text: 'Нотатка із ID - {' + req.params.id + '} була оновлена!'});
    });

}
