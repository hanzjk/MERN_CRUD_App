const express = require('express');
const Students = require('../models/student');
const Student = require('../models/student');

const router = express.Router();

const auth=require('../middleware/auth')

//add new student 
router.post('/student/save', (req, res) => {
    let newStudent = new Student(req.body);
    newStudent.password = newStudent.generateHash(newStudent.password);

    newStudent.save((err) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            success: "Student added successfully"
        });
    })
});

//get all student info
router.get('/students',(req, res) => {
    Students.find().exec((err, students) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            existingStudents: students
        });
    });

});

//update student details
router.put('/student/update/:id', (req, res) => {
    Students.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        (err, student) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            return res.status(200).json({
                success: "Updated successfully"
            });
        }
    )

});


//delete a student 
router.delete('/student/delete/:id', (req, res) => {
    Students.findByIdAndRemove(req.params.id).exec((err, deletedStudent) => {
        if (err) return res.status(400).json({
            error: err
        });

        return res.status(200).json({
            success: "Deleted successfully", deletedStudent
        });
    });

});

//get details of a specific student
router.get('/student/:id', (req, res) => {
    let studentId = req.params.id;
    Students.findById(studentId, (err, student) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        return res.status(200).json({
            success: true,
            student
        });
    });

});




module.exports = router;
