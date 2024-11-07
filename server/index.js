// index.js
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const signatureRoute = require('./routes/signature');

const corsOptions = {
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());  // Middleware to parse JSON request bodies
app.use('/api', signatureRoute);


// Import routes
const employees = require('./routes/employees');
const upload = require('./routes/upload');

// Connect to MongoDB
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully to MongoDB");
});

// Use the routes
app.use('/employee', employees);
app.use('/upload', upload);

// Start the server
app.listen(3100, () => console.log('Server started on port 3100'));
