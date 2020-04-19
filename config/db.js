const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Successfully Connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// const url = require('./default.json').mongoURI;

// mongoose.connect(process.env.MONGODB_URI || url)
//          .then(()=> console.log("mongodb succefully connencted"))
//         .catch((err)=> console.log(err));
