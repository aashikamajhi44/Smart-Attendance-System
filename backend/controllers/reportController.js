const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// @desc    Summary report — total students, present/absent count for a date range
// @route   GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
const getSummaryReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const totalStudents = await Student.countDocuments();

    const filter = {};
    if (from && to) {
      filter.date = { $gte: from, $lte: to };
    }

    const records = await Attendance.find(filter).populate(
      "student",
      "name studentId department"
    );

    const presentCount = records.filter((r) => r.status === "Present").length;
    const lateCount = records.filter((r) => r.status === "Late").length;

    res.json({
      totalStudents,
      totalRecords: records.length,
      presentCount,
      lateCount,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummaryReport };