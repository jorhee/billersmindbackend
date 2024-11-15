// routes/profile.js
const jwt = require('jsonwebtoken');

const express = require('express');

const profileController = require("../controllers/profile");
const auth = require("../middleware/auth");

const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

const router = express.Router();

const multer = require('multer');
const path = require('path');

// User model (for reference)
const User = require('../models/User'); // Ensure you require your User model

// Register user profile
router.post('/register', verify, isLoggedIn, verifyAdmin, profileController.registerUser);

//Login user
router.post("/login", profileController.loginUser);

// Get user profile
router.get('/me', verify, isLoggedIn, profileController.getUserProfile);

//Set user as admin

router.patch('/:id/set-as-admin', verify, verifyAdmin, isLoggedIn,profileController.updateUserAdminStatus);

//update password
router.patch('/update/', verify, isLoggedIn, profileController.updateUserDetails);    

// Delete user profile
router.delete('/:userId', verify, verifyAdmin, profileController.deleteProfile);


// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage });

// Add route for uploading profile pictures
router.post('/upload/:userId', verify, upload.single('profilePicture'), async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId);
    if (!profile) return res.status(404).send('Profile not found');

    // Handle file upload (store the file path temporarily if needed)
    const profilePicturePath = `/${req.file.path}`; // Save path to the uploaded image
    res.json({ message: 'Profile picture uploaded successfully', profilePicturePath });
  } catch (error) {
    res.status(500).send('Server error');
  }
});


/*// Get the current logged-in user's profile
router.get('/me', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Fetch user profile excluding password
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


*/


module.exports = router;
