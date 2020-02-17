var express = require('express');
var router = express.Router();
const noteController = require('../controllers/noteController');
var multer  = require('multer');
/* GET users listing. */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Тыльки .png, .jpg and .jpeg дозволені!'));
        }
    }
});

router.get('/', noteController.getNotes);
router.post('/', upload.single('noteThumb'), noteController.createNote);
router.post('/:id', upload.single('noteThumb'), noteController.editNote);
router.delete('/:id', noteController.removeNote);
router.get('/:id', noteController.getNote);

module.exports = router;
