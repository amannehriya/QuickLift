const mongoose = require('mongoose');

async function connectToDb() {
   await mongoose.connect(process.env.MONGO_URI).
        then(() => {
            console.log("connected to db")
        })
        .catch(err => console.log(err))
}

module.exports = connectToDb;