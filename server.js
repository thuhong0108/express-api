import express from "express";
import mongoose from "mongoose";
import userRoute from './routes/user.js';

// Connect to MongoDB
mongoose.connect('mongodb+srv://tranthuhong0108:ttth0108@cluster0.hzbidjr.mongodb.net', () => {
    console.log('Connected to MongoDB');
});

const app = express();
app.use(express.json());

// ROUTES
app.use('/api/user', userRoute);

// Start server
app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});

