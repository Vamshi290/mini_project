const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Include name as required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
