const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const protectedRoute = require('./routes/protectedRoute');
const orderRoute = require('./routes/orders');
const userRoute = require('./routes/users');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.mongoUri;



// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send('Welcome to the ecommerce server!');
})

require('./config/passport');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoute);
app.use('/users', userRoute);

mongoose.connect(mongoUri)
    .then(() => {
        console.log("Connected to Database");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((e) => {
        console.log("There was an error connecting to database");
    })

