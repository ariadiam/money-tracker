const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes'); 

app.use('/api/users', userRoutes);          
app.use('/api/transactions', transactionRoutes);  

module.exports = app;