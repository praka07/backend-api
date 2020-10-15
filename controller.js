"use strict";
const daoOperations = require('./routes/daooperations');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const uri = process.env.CONNECTION_DETAILS || "mongodb+srv://demo:demo@cluster0.kfh2h.mongodb.net/poc?retryWrites=true&w=majority";

mongoose.connect(uri).then(() => console.log('Connected…'))
    .catch(err => console.error('Connection failed…'));


app.use(express.json());
app.use('/', daoOperations);

app.listen(process.env.PORT || 5050, () => {
    console.log('server is running on port 5050..');
});