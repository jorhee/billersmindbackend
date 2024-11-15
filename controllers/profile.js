const bcrypt = require("bcrypt");
const User = require('../models/User');
const auth = require("../middleware/auth");
const { errorHandler, authMiddleware } = auth;
const jwt = require('jsonwebtoken');


// Create or update user profile

module.exports.registerUser = (req, res) => {

		const {firstName, lastName, email, password, mobileNo } = req.body;

		// Basic email validation (checks for presence of "@" and ".")

		if (!email.includes("@") || !email.includes(".")){
			return res.status(400).send({ message: "Email invalid."})
		}	

		// Password length validation	
		if (password.length < 8){
			return res.status(400).send({ message: "Password must be atleast 8 characters."})
		}	

		// Convert mobileNo to string if it's passed as a number
		const mobileStr = String(mobileNo);
		//and check for exactly 11 digits
		if (mobileStr.length !== 11 || isNaN(mobileStr)){
			return res.status(400).send({ message: "Mobile number invalid."})
		} 

		// Check if user with the same email already exists
			User.findOne({email : req.body.email})
				.then(user => {
				if (user){
					return res.status(409).send({ message: "Duplicate User's email."});
				} else {

					let newUser = new User({
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						email: req.body.email,
						mobileNo: req.body.mobileNo,
						//10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password.
						password: bcrypt.hashSync(req.body.password, 10)
					})

						newUser.save()
						.then(savedUser=>{
							let newResult = savedUser.toObject()
							return res.status(201).send({ 
								message: "Registered Successfully.", 
								user: newUser });
						})
						.catch(err =>errorHandler(err, req, res));
					}	
				})
				.catch(err =>errorHandler(err, req, res));
		};




module.exports.loginUser = async (req, res) => {

const { email, password } = req.body;
  // Authenticate user (find user in the database, verify password, etc.)
try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: `${email} does not exist.` });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token back to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// get User profile:

/*module.exports.getUserProfile = async (req, res) => {

		return User.findById(req.user.id)
    .then(user => {

        if(!user){
            // if the user has invalid token, send a message 'invalid signature'.
            return res.status(403).send({ message: 'invalid signature' })
        }else {
            // if the user is found, return the user.
            user.password = "";
            return res.status(200).send({user});
        }  
    })
    .catch(error => errorHandler(error, req, res));
};
*/
module.exports.getUserProfile = async (req, res) => {

	try {
	    const userId = req.user.id; // Assuming you set req.user.id in the verify middleware
	    const user = await User.findById(userId).select('-password'); // Exclude password from response
	    if (!user) return res.status(404).json({ message: 'User not found' });
	    
	    res.json({
	    	firstName: user.firstName,
  			lastName: user.lastName,
  			email: user.email,
  			mobileNo: user.mobileNo
	    });
	  } catch (error) {
	  	console.error('Error fetching user profile:', error); // Log the error
	    res.status(500).json({ message: 'Server error' });
	  }
	};



//update user to admin

module.exports.updateUserAdminStatus = async (req, res) => {
    // Get user ID from the request parameters (req.params, not req.body)
    const { id } = req.params;

    // Validate the ID format before querying the database
    if (!id) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    try {
        // Find the user by ID in the database
        const user = await User.findById(id);
        
        if (!user) {
            // Return early if user not found
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if the user is already an admin
        if (user.isAdmin) {
            return res.status(400).send({ error: 'User is already an admin' });
        }

        // Update the user to admin status
        user.isAdmin = true;
        const updatedUser = await user.save();

        // Send updated user info if save was successful
        res.status(200).send({ updatedUser });
    } catch (error) {
        // Handle any errors
        console.error(error);
        return res.status(500).send({
            error: 'Failed to update user admin status',
            details: error.message, // Error message for more clarity
        });
    }
};

//Update Password - v1

/*module.exports.updatePassword = async (req,res) => {

	const userId = req.user.id 

	const { currentPassword, newPassword } = req.body

	try {
		const user = await User.findById(userId)
		if (!user){
			return res.status(404).send({ message: 'User not found' });
		}	
		//to check if currentPassword is correct:
		const isCurrentPwCorrect = bcrypt.compareSync(currentPassword, user.password)
		if (!isCurrentPwCorrect){
				// If currentPassword is not correct
				return res.status(403).send({ message: "Current password does not match"})
		}

		// Check if new password is the same as the current password
        const isNewPasswordSameAsCurrent = bcrypt.compareSync(newPassword, user.password);
        if (isNewPasswordSameAsCurrent) {
            return res.status(400).send({ error: "New password cannot be the same as the current password." });
        }
		if (newPassword.length < 8){
			return res.status(400).send({ error: "Password must be atleast 8 characters."})
	
		}	
		//update current pw to newPassword
		user.password = bcrypt.hashSync(newPassword, 10)

		await user.save()

		return res.status(200).send({ message: "Password updated successfully!."})

	}

	catch (error) {
        // Catch any errors during the process and send a message to the client
        return res.status(500).send({
            message: 'Error updating password',
            error: error.message
        });
    }

};*/

//vr2 update user's pw or email:

module.exports.updateUserDetails = async (req, res) => {
  const userId = req.user.id; // Authenticated user ID
  const { currentPassword, newPassword, newEmail } = req.body; // Extract fields

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let isUpdated = false; // To track if any updates are made

    // If the user wants to update their password
    if (newPassword && newPassword.trim() !== "") {
      // Check if currentPassword is provided and correct
      if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(403).send({ message: 'Current password does not match' });
      }

      // Check if new password is different from the current password
      if (bcrypt.compareSync(newPassword, user.password)) {
        return res.status(400).send({ message: 'New password cannot be the same as the current password.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
      }

      // Update the password
      user.password = bcrypt.hashSync(newPassword, 10);
      isUpdated = true;
    }

    // If the user wants to update their email
    if (newEmail && newEmail.trim() !== "" && newEmail !== user.email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).send({ message: 'Email is already in use.' });
      }

      user.email = newEmail; // Update email
      isUpdated = true;
    }

    if (isUpdated) {
      await user.save(); // Save only if there are updates
      return res.status(200).send({ message: 'User details updated successfully!' });
    } else {
      return res.status(400).send({ message: 'No changes made. Please provide valid data to update.' });
    }

  } catch (error) {
    // Catch any errors and respond
    return res.status(500).send({
      message: 'Error updating user details',
      error: error.message,
    });
  }
};

// Delete user profile
module.exports.deleteProfile = async (req, res) => {
	const userId = req.params;
  try {
    await User.deleteOne({ userId });
    res.send('Profile deleted');
  } catch (error) {
  	errorHandler(error, req, res);
  }
};