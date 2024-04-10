const express = require('express')
const router = express.Router();
const {loginController ,registerController, authController,applyDoctorController , getAllNotificationController ,deleteAllNotificationController, getAllDoctorsController} = require('../controllers/userctrl');
const authMiddleware = require('../middlewares/authMiddleware');
//A POST request is one of the HTTP methods used to send data to a server. It's commonly used when submitting a form or when you need to send data to a server for processing. 

//routes
//LOGIN || POST
router.post('/login' , loginController)
//REGISTER || POST
router.post('/register' , registerController)
//Auth || POST
router.post('/getUserData' , authMiddleware , authController);  
//Applydoctor || POST
router.post('/apply-doctor' , authMiddleware , applyDoctorController);
//Notification || POST
router.post('/get-all-notification' , authMiddleware , getAllNotificationController);
router.post('/delete-all-notification' , authMiddleware ,deleteAllNotificationController);
//Get doctors
router.get('/getAllDoctors' , authMiddleware , getAllDoctorsController);
module.exports = router; 