const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email }); 
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;  //This line extracts the password from the request body.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //This line hashes the password using the hash function from the bcrypt library. It takes two arguments: the password to be hashed (password) and the salt generated in the previous step (salt). The function asynchronously returns the hashed password.
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};
//GET ALL DOC
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification); //the spread operator (...) to push all elements from the notification array into the seennotification array.
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
};










    //findOne(): This is a Mongoose method used to query the MongoDB collection and find a single document that matches the specified criteria. It takes an object as an argument, where you can define the conditions to search for. In this case, it's searching for a user document where the email field matches req.body.email. req.body.email likely contains the email address received from the client in a request body.
    // const exisitingUser = await userModel.findOne({ email: req.body.email }); This line of code essentially queries the database to find a user document based on the provided email address (req.body.email). If a user with that email exists in the database, exisitingUser will contain the user document. Otherwise, it will be null. This is commonly used for tasks like user authentication or checking if a user with a specific email already exists before attempting to create a new account.

    //Bcrypt
// bcrypt.js is a JavaScript library used for hashing passwords securely. It provides a way to hash passwords before storing them in a database and to compare hashed passwords during authentication.
//This line generates a salt using the genSalt function from the bcrypt library. A salt is a random value used to increase the complexity of the hashing process, making it more difficult for attackers to use precomputed tables (rainbow tables) to crack hashed passwords. The 10 passed as an argument specifies the number of rounds used to generate the salt. The higher the number, the more secure the hashing process, but it also increases the computation time.
//const hashedPassword = await bcrypt.hash(password, salt);
//This line hashes the password using the hash function from the bcrypt library. It takes two arguments: the password to be hashed (password) and the salt generated in the previous step (salt). The function asynchronously returns the hashed password.
//req.body.password = hashedPassword;  //Finally, this line replaces the original password in the req.body object with the hashed password. This ensures that only the hashed password is stored or used further in the application.bcrypt.genSalt() and bcrypt.hash() are asynchronous functions that return Promises.
//Here's a breakdown of what a controller does:

// Receives User Input: The controller receives input from the user via the view. This input could be from various sources such as form submissions, button clicks, or URL parameters.

// Interprets Input: Once the input is received, the controller interprets it to understand the user's intentions. It decides how to handle the input based on the application's logic.

// Manipulates the Model: After interpreting the input, the controller interacts with the model to perform any necessary actions. This could involve querying the database, updating data, or invoking business logic methods.

// Updates the View: Once the model is updated, the controller instructs the view to reflect those changes. It sends data back to the view, which then renders the updated user interface for the user to see.

//t's important to understand that userModel represents the entire collection of users in your database, not just a single user. When you use functions like findOne() or find(), you're querying this collection to retrieve one or more documents that match your criteria.

// In your code snippet, userModel.findOne({ isAdmin: true }) is searching for a single document in the "users" collection where the isAdmin field is set to true. This assumes that there is only one admin user in the system.hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// The "controller folder" in a web application typically holds files that contain the logic for handling incoming requests from users. 

//Use app.post() for global route handlers that apply to all routes in your Express application.
// Use router.post() for route handlers specific to routes within a particular router or route group.