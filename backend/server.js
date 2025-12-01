require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');

const app=express();

app.use(express.json());
app.use(cors());

connectDB(process.env.MONGO_URI);

app.use('/api/translations',require('./routes/translations.js'));

app.get('/',(req,res)=>{
  res.send('TMT backend is runnnig')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`server is running on port: ${PORT}`)
});

