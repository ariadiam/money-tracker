const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes'); 
const authRoutes = require('./routes/auth.routes');

app.use(cors({
  origin: ['http://localhost:3000']
}))

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);          
app.use('/api/transactions', transactionRoutes);  

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.options));

module.exports = app;