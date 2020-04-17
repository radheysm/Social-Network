const express = require('express');
const connectDB = require('./config/db');
const app = express();


// Connect Database
connectDB();

app.get('/', (req,res) => res.send('API Running'));

const PORT = process.env.PORT || 5001;


app.listen(PORT, ()=>{
    console.log(`server start on port ${PORT}`);
})




