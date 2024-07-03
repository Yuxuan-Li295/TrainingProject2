const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const multer = require('multer');

// 创建或更新员工信息
router.post('/profile', async (req, res) => {
    const { userId, firstName, lastName, email } = req.body;
    try {
        const existingEmployee = await Employee.findOne({ userId });
        if (existingEmployee) {
            // 更新现有记录
            await Employee.updateOne({ userId }, req.body);
            return res.status(200).send('Employee updated successfully');
        } else {
            // 创建新记录
            const newEmployee = new Employee(req.body);
            await newEmployee.save();
            return res.status(201).send('Employee created successfully');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

// 文件上传
router.post('/upload', upload.single('file'), async (req, res) => {
    const { userId } = req.body;
    try {
        const url = req.file.path;
        await Employee.updateOne({ userId }, { $push: { documents: { documentType: req.file.mimetype, documentURL: url } } });
        res.status(200).send('File uploaded successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
