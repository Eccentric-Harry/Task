require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");

// Middleware setup
app.use(cors({ origin: "http://localhost:3000" })); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Import routes
const employees = require('./routes/employees');
const upload = require('./routes/upload');
const signatureRoute = require('./routes/signature');
const adminRoute = require('./routes/admin'); // Import admin route

// Connect to MongoDB
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connected successfully to MongoDB");
});

// Use the routes
app.use('/employee', employees);
app.use('/upload', upload);
app.use('/signature', signatureRoute);
app.use('/admin', adminRoute); // Added admin route for login

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// index.js
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(middleware.route);
    }
});
