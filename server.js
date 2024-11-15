const express = require('express');
const cors = require('cors');
const connectDB = require('./config');

const app = express();

const profileRoutes = require('./routes/profile');
const providerRoutes = require('./routes/provider');
const payerRoutes = require('./routes/payer');
const patientRoutes = require('./routes/patient');
const batchedNoaRoutes = require('./routes/batchedNoa');




require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));   

// Connect to MongoDB
connectDB();

/*// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});
*/

//will allow us to customize CORS options to meet our specific requirements
const corsOptions = {
    origin: [`http:localhost:3000`], //allows request from this origin (client's URL)
    //method: ['GET','POST'] - You can add this property to limit the access to this method.
    credentials: true, //allow credentials (e.g. authorization headers)
    optionsSuccessStatus:200 //provides status code to use for successful OPTIONS requests.
}
app.use(cors(corsOptions));



//routes
app.use('/profiles', profileRoutes);
app.use('/providers', providerRoutes);
app.use('/payers', payerRoutes);
app.use('/patients', patientRoutes);
app.use('/batchedNoa', batchedNoaRoutes);


// In your Express server
app.get('/ping', (req, res) => {
    res.sendStatus(200); // Respond with a 200 OK status
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
