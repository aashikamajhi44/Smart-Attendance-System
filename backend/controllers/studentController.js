const crypto = require("crypto");
const Student = require("../models/Student");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new student (+ auto-generate student login + email credentials)
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { studentId, name, email, department } = req.body;

    if (!studentId || !name || !email || !department) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const exists = await Student.findOne({ $or: [{ studentId }, { email }] });
    if (exists) {
      return res.status(400).json({ message: "Student ID or email already exists" });
    }

    const student = await Student.create({ studentId, name, email, department });

    const tempPassword = crypto.randomBytes(4).toString("hex");

    await User.create({
      name,
      email,
      password: tempPassword,
      role: "student",
      linkedStudentId: student._id,
      mustChangePassword: true,
    });

    await sendEmail({
      to: email,
      subject: "Your Smart Attendance System Login",
      html: `
        <p>Hello ${name},</p>
        <p>Your account has been created. Use these credentials to log in and view your attendance:</p>
        <p><b>Email:</b> ${email}<br/><b>Temporary Password:</b> ${tempPassword}</p>
        <p>You will be asked to change your password on first login.</p>
      `,
    });

    res.status(201).json({ message: "Student added and login email sent", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    Object.assign(student, req.body);
    const updated = await student.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await student.deleteOne();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };