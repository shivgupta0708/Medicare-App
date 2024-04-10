const express = require('express')
const morgan = require('morgan')
// In the context of Express.js, "morgan" refers to a popular middleware used for logging(recording or documenting events, actions, or data that occur during the execution of a program or system) HTTP requests. It's a third-party module that simplifies the process of recording information about incoming HTTP requests in a Node.js application.
const colors = require('colors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
// The dotenv module is a popular npm package used in Node.js applications to manage environment variables.It allows you to load variables from a .env file into process.env, making it easy to keep sensitive information (like API keys, database passwords, etc.) separate from your code and configuration.

//config dotenv
const envpath = path.join(__dirname , 'routes' , '.env'); //This line constructs the file path to your .env file.path.join() is a method from the path module that joins multiple path segments together to form a single path. In this case, it joins the directory name (__dirname), the 'routes' directory, and the filename '.env' to form the complete path to the .env file.
dotenv.config({path : envpath});
//dotenv is a popular npm package used for loading environment variables from a .env file into process.env.
//dotenv.config() is a method from the dotenv package that loads the environment variables.{path : envpath} This is an object literal with a single property path, where the value of path is the variable envpath that you defined earlier.

//make sure to call connectDB after config .env
connectDB();
//rest object
const app = express();

//middlewares
app.use(express.json())
app.use(morgan('dev'))
//Concise output colored by response status for development use. The :status token will be colored green for success codes, red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for information codes.
//bdown written code is telling the Express application to use the router or middleware located at ./routes/userrouters for any request that starts with /api/v1/user.
app.use('/api/v1/user' , require('./routes/userrouters'));
app.use('/api/v1/admin' , require('./routes/adminRoutes'))
app.use('/api/v1/doctor' , require('./routes/doctorRoutes'))
//listen port
const port = process.env.PORT ;

app.listen(port , ()=>{
    console.log(`Server running at ${process.env.NODE_MODE} mode on ${process.env.PORT} host`)
})