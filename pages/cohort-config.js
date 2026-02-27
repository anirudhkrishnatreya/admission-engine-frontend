import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import withAuth from "../utils/withAuth";
import API from "../utils/api";
import { useToast } from "../components/ToastContext";
import LoadingButton from "../components/LoadingButton";
import { handleApiError } from "../utils/handleApiError";
import { jwtDecode } from "jwt-decode";

function CohortConfig() {
  const { showToast } = useToast();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);

  const [form, setForm] = useState({
    institution: "",
    cohort: "",
    minAge: "",
    maxAge: "",
    graduationYearMin: "",
    graduationYearMax: "",
    minPercentage: "",
    minCgpa: "",
    minScreeningScore: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setRole(decoded.role);
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const res = await API.get("/cohort-config");
    setConfigs(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.post("/cohort-config", form);
      showToast("Configuration saved successfully");
      fetchConfigs();
    } catch (err) {
      const errors = handleApiError(err);
      showToast(errors[0], "error");
    } finally {
      setLoading(false);
    }
  };

  if (role !== 0) {
    return (
      <Layout>
        <h2 className="text-red-600">
          Access Denied
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">
        Cohort Eligibility Configuration
      </h1>

      <div className="bg-white p-10 rounded-2xl shadow-lg mb-12">

        {/* Basic Info */}
        <h2 className="text-xl font-semibold mb-6">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2 font-medium">
              Institution Name
            </label>
            <input
              name="institution"
              value={form.institution}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
              placeholder="e.g. IIT Delhi"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Cohort Year
            </label>
            <input
              name="cohort"
              value={form.cohort}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
              placeholder="e.g. 2026"
            />
          </div>
        </div>

        {/* Age Criteria */}
        <h2 className="text-xl font-semibold mb-6">
          Age Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2 font-medium">
              Minimum Age
            </label>
            <input
              name="minAge"
              type="number"
              value={form.minAge}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Maximum Age
            </label>
            <input
              name="maxAge"
              type="number"
              value={form.maxAge}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Academic Criteria */}
        <h2 className="text-xl font-semibold mb-6">
          Academic Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2 font-medium">
              Graduation Year (From)
            </label>
            <input
              name="graduationYearMin"
              type="number"
              value={form.graduationYearMin}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Graduation Year (To)
            </label>
            <input
              name="graduationYearMax"
              type="number"
              value={form.graduationYearMax}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Minimum Percentage
            </label>
            <input
              name="minPercentage"
              type="number"
              value={form.minPercentage}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Minimum CGPA (10 Scale)
            </label>
            <input
              name="minCgpa"
              type="number"
              value={form.minCgpa}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Minimum Screening Score
            </label>
            <input
              name="minScreeningScore"
              type="number"
              value={form.minScreeningScore}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <LoadingButton loading={loading} onClick={handleSubmit}>
          Save Configuration
        </LoadingButton>
      </div>

      {/* Existing Configs Table */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6">
          Existing Configurations
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-3">Institution</th>
              <th>Cohort</th>
              <th>Age Range</th>
              <th>Grad Year</th>
              <th>Min %</th>
              <th>Min CGPA</th>
              <th>Min Score</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{c.institution}</td>
                <td>{c.cohort}</td>
                <td>{c.minAge} - {c.maxAge}</td>
                <td>{c.graduationYearMin} - {c.graduationYearMax}</td>
                <td>{c.minPercentage}</td>
                <td>{c.minCgpa}</td>
                <td>{c.minScreeningScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}

export default withAuth(CohortConfig);