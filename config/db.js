const mongoose = require('mongoose') //Node.js library for interacting with MongoDB databases.
const colors = require('colors') //This library provides text colorization for the console output
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Server Issue ${error}.`)
    }

}


// The mongoose.connect() method returns a promise, which resolves or rejects asynchronously based on whether the connection to the MongoDB database is successful or not. By using the async keyword, the connectDB function can use await to pause execution until the promise returned by mongoose.connect() settles (either resolves or rejects).
module.exports = connectDB ;