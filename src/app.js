const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
require('./database/mongo')
app.use('/', require('./router'))

module.exports = app;