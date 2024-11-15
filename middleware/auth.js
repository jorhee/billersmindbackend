const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

require('dotenv').config();


/*module.exports.authMiddleware = (user) =>{

  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  }

  // Generate a JSON web token using the jwt's sign method
    // Generates the token using the form data and the secret code with no additional options provided
    // SECRET_KEY is a User defined string data that will be used to create our JSON web tokens
  return jwt.sign(data, process.env.JWT_SECRET, {});

};*/

//version 2

// Middleware to verify token
/*module.exports.authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  console.log("This is the token: " + token);

  try {
    // Verify token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    req.user = { id: decoded.id}; // Attach user info to req.user (e.g., req.user.id)
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
*/

//version 3

module.exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  console.log("This is the token: " + token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

//[Token Verification]

/*module.exports.verify = (req, res, next) =>{

  console.log(req.headers.authorization);
  //bearer token
  //"req.headers.authorization" contains sensitive data and especially our token
  //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjU0YTA1M2NjOTk4NTE5NzMzZDA1MyIsImVtYWlsIjoiam9obkBtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3Mjc0MzM0OTV9.HYGHQCuIEiXxS1pHPQwoj7wlyppp0VijLdIVDkZ-TMA
  let token = req.headers.authorization;


  if(typeof token === "undefined"){
    return res.send({auth: "Failed. No Token"})
  }
  else{
    console.log(token);
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjU0YTA1M2NjOTk4NTE5NzMzZDA1MyIsImVtYWlsIjoiam9obkBtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3Mjc0MzM0OTV9.HYGHQCuIEiXxS1pHPQwoj7wlyppp0VijLdIVDkZ-TMA
    token = token.slice(7, token.length);

    console.log(token)
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjU0YTA1M2NjOTk4NTE5NzMzZDA1MyIsImVtYWlsIjoiam9obkBtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3Mjc0MzM0OTV9.HYGHQCuIEiXxS1pHPQwoj7wlyppp0VijLdIVDkZ-TMA


    //[Token decryption]

    jwt.verify(token, process.env.JWT_SECRET, function(err, decodedToken){

      if(err){
        return res.status(403).send({
          auth: "Failed",
          message: err.message
        });
      }else{

        console.log("result from verify method")
        console.log(decodedToken)

        req.user = decodedToken;

        next();
      }
    })
  }
};*/


//version 2
module.exports.verify = async (req, res, next) =>{
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



//[Verify Admin]

module.exports.verifyAdmin = (req,res,next)=>{
  console.log("result from verifyAdmin method");
  console.log(req.user);

  if(req.user.isAdmin){
    next()
  }else{
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden"
    })
  }
}



module.exports.errorHandler = (err, req, res, next) => {

  console.error(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || 'SERVER_ERROR',
      details: err.details || null
    }
  })
}

module.exports.isLoggedIn = (req, res, next) => {
  if(req.user){
    next()
  } else {
    res.sendStatus(401);
  }
}

