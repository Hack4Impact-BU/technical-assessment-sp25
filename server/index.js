import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import userRouter from "./routes/userRouter.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "GET", "DELETE"]
}))

app.use(morgan('dev'));

app.use('/api', userRouter);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});