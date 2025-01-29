const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  EmployeeModel.findOne({ email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          if (result) {
            const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: "Success", token });
          } else {
            res.status(401).json({ message: "Invalid password" });
          }
        });
      } else {
        res.status(404).json({ message: "No record found" });
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    });
});

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
      }

      const newEmployee = new EmployeeModel({ email, password: hashedPassword, name, role });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
