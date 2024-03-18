const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const course = require('./routes/course');
const modules = require('./routes/module');
const chapter = require('./routes/chapter');
const lesson = require('./routes/lesson');
const enrollment = require('./routes/enrollment');
const errorMiddleware = require('./middlewares/errors');
app.use(express.json({ limit: '100mb' }));
// app.set("trust proxy", 1);
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true}))
app.use(cookieParser());
app.use(express.urlencoded({limit: "100mb", extended: true }));

app.use('/api/v1', products);
app.use('/api/v1',auth);
app.use('/api/v1', order);
app.use('/api/v1', course);
app.use('/api/v1', modules);
app.use('/api/v1', chapter);
app.use('/api/v1', lesson);
app.use('/api/v1', enrollment);

app.use(errorMiddleware);
module.exports = app