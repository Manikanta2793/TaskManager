import express from 'express';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import cors  from 'cors';

dotenv.config(); //loads env vars


const app = express();

app.use(cors({
    origin:['http://localhost:5173','https://taskmanager-1-xx5d.onrender.com'],
    credentials:true
    
}));

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("server is working");
});

app.use('/api/auth',authRoutes);   
app.use('/api/tasks',taskRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('MongoDB connected');
    app.listen(5000,()=>{
        console.log('server running on port 5000')
    })
    
}).catch((err)=>console.log(err));




