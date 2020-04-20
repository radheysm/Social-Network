const express = require('express');
const connectDB = require('./config/db');
const app = express();


// Connect Database
connectDB();

// Init Middleware

app.use(express.json({exteded:false}));


app.get('/', (req,res) => res.send('API Running'));


// Define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/posts'));


const PORT = process.env.PORT || 5001;


app.listen(PORT, ()=>{
    console.log(`server start on port ${PORT}`);
})




