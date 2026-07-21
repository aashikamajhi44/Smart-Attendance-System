import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../../services/studentService";

const AddStudent = () => {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    department: "BSc CSIT",
  });
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!consent) {
      setError("Please confirm biometric data consent before continuing.");
      return;
    }

    setLoading(true);
    try {
      await studentService.addStudent(form);
      setSuccess("Student added successfully! A login email has been sent.");
      setTimeout(() => navigate("/students"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-lg font-bold text-gray-900 mb-1">Add Student</h1>
      <p className="text-sm text-gray-500 mb-6">
        Enrol student details. A login email will be sent automatically.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rojina Gurung"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Student ID
            </label>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. BCS-052"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@college.edu.np"
            required
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600 bg-white"
          >
            <option>BSc CSIT</option>
            <option>BBA</option>
            <option>BBS</option>
          </select>
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-600 mb-5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          I confirm the student has consented to biometric face data capture
          and storage, per institutional policy.
        </label>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-700 text-sm mb-3">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;