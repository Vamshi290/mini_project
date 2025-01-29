const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const EmployeeModel = require('./models/Employee');
const LostFoundItemsModel = require("./models/LostFoundItems");
const LostFound = require("./LostFound");
const authRoutes = require("./authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/LostFoundItem")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Session setup
app.use(session({
  secret: 'your-secret-key',  // This secret key is used to sign the session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set secure: true if using https
}));

// Admin role authorization middleware using session
const verifyAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Routes for login and registration
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = { userId: user._id, role: user.role }; // Store user info in session
        return res.json({ message: "Success" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    }
    return res.status(404).json({ message: "No record found" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

app.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new EmployeeModel({ email, password: hashedPassword, name, role });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Error saving to database", error: err });
  }
});

// Middleware to verify session
const verifySession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the 'uploads' folder if it doesn't exist
}

// Set up multer storage engine (store files in the 'uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Define the folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp to avoid collisions
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Serve uploaded images from the 'uploads' directory
app.use('/uploads', express.static(uploadDir));

// Use LostFound and authRoutes middleware
app.use(LostFound);
app.use(authRoutes);

// Route to handle POST requests for lost and found items with image upload
// Route for submitting a lost/found item
app.post("/lostfound", verifySession, upload.single("image"), (req, res) => {
  const { name, category, description, location, itemType } = req.body;
  const image = req.file ? req.file.path : null;

  if (!name || !category || !description || !location || !itemType) {
      return res.status(400).json({ message: "All fields are required." });
  }

  // Add current date if no date is provided
  const date = new Date();

  LostFoundItemsModel.create({
      name,
      category,
      description,
      location,
      date, // Save the current date
      itemType,
      image,
  })
      .then((lostFoundItem) => res.json(lostFoundItem))
      .catch((err) => res.status(500).json({ error: err.message }));
});

// Route for updating item status (approve/reject)
app.patch("/lostfound/update/:id", async (req, res) => {
  try {
      const { status } = req.body; // e.g., "approved" or "rejected"
      const updatedItem = await LostFoundItemsModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updatedItem) {
          return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(updatedItem);
  } catch (error) {
      res.status(500).json({ message: "Error updating item status", error });
  }
});

// Route to fetch all pending items
app.get('/lostfound/pending', async (req, res) => {
  try {
    const pendingItems = await LostFoundItemsModel.find({ status: 'pending' });
    res.json(pendingItems);
  } catch (error) {
    console.error("Error fetching pending items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to fetch all approved lost items
app.get("/lostfound/lost", async (req, res) => {
  try {
      const lostItems = await LostFoundItemsModel.find({ status: "approved", itemType: "lost" });
      res.status(200).json(lostItems);
  } catch (error) {
      res.status(500).json({ message: "Error fetching lost items", error });
  }
});

// Route to fetch all approved found items
app.get("/lostfound/found", async (req, res) => {
  try {
      const foundItems = await LostFoundItemsModel.find({ status: "approved", itemType: "found" });
      res.status(200).json(foundItems);
  } catch (error) {
      res.status(500).json({ message: "Error fetching found items", error });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});