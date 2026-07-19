const Attendance = require("../models/Attendance");

// Format a Date object as "YYYY-MM-DD"
const formatDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

// Check whether attendance already exists for this student today
const hasMarkedToday = async (studentId) => {
  const today = formatDate();
  const existing = await Attendance.findOne({ student: studentId, date: today });
  return !!existing;
};

// Mark attendance if not already marked today
const markAttendance = async (studentId, confidenceScore = 0) => {
  const today = formatDate();
  const now = new Date();
  const time = now.toLocaleTimeString();

  const alreadyMarked = await hasMarkedToday(studentId);
  if (alreadyMarked) {
    return { alreadyMarked: true, record: null };
  }

  const record = await Attendance.create({
    student: studentId,
    date: today,
    time,
    status: "Present",
    confidenceScore,
  });

  return { alreadyMarked: false, record };
};

module.exports = { formatDate, hasMarkedToday, markAttendance };