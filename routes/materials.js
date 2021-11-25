const multer = require('multer');
const express = require('express');
const router = express.Router();
const Material = require('../models/materials');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'client/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });



//save material
router.post('/materials/save', upload.single('img'),(req, res) => {
    var obj = new Material({
        name: req.body.name,
        img: req.file.originalname
    });
    Material.create(obj, (err, item) => {
        if (err) {
            return res.status(400).json({ msg: err })
        }

        return res.status(200).json({
            success: true
        });
    });
});


//get materials
router.get('/materials', (req, res) => {
    Material.find().exec((err, materials) => {
        if (err) {
            return res.status(400).json({ msg: err })
        }

        return res.status(200).json({
            success: true,
            existingMaterials: materials
        });
    });
});

module.exports = router;