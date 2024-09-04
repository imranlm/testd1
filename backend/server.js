// const express = require('express');
// require('dotenv').config();
// const path = require('path');
// const cors=require('cors');
// const bodyParser=require('body-parser');
// const cookieParser = require("cookie-parser");

// const Payment=require('./Routes/Payment/Payment');
// const Register=require('./Routes/Authentication/Register');

// const PORT=5000;

// const app = express();

// app.use(express.static("client/dist"));
// app.use(express.json());
// app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser());



// app.use('/',Payment);
// app.use('/auth',Register);


// app.listen(PORT, () => {
//   console.log(`Node server listening at http://localhost:${PORT}/`);
// });


// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/authRoutes');
const cors=require('cors');
const bodyParser=require('body-parser');
const studentRoutes=require('./Routes/studentRoutes')
const dataRoutes=require('./Routes/dataRoutes');
const instructorRoutes=require('./Routes/instructorRoutes');
const paymentRoutes=require('./Routes/paymentRoutes');

const app = express();
// const corsOptions = {
//     origin: 'https://pmmi-web-frontend.onrender.com', // Specific frontend URL
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   };
  
//   app.use(cors(corsOptions));
  

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// Use routes
app.use('/auth', authRoutes);
app.use('/student',studentRoutes);
app.use('/courses',dataRoutes);
app.use('/instructor',instructorRoutes);
app.use('/payment',paymentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
