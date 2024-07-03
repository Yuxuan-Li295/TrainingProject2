const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employee');

// 中间件
app.use(bodyParser.json());
app.use(cors());

// 基本路由
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

// 连接到MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
