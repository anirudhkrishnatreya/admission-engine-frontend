import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import withAuth from "../utils/withAuth";
import { jwtDecode } from "jwt-decode";
import API from "../utils/api";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [institution, setInstitution] = useState("All");
  const [cohort, setCohort] = useState("All");

  const [summary, setSummary] = useState({
    total: 0,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 DEMO fallback data
  const demoData = {
    summary: {
      total: 3,
      lowRisk: 1,
      mediumRisk: 1,
      highRisk: 1,
    },
    candidates: [
      {
        _id: "1",
        fullName: "Rahul Sharma",
        institution: "IIT Delhi",
        cohort: "2026",
        exceptionCount: 0,
        createdBy: { name: "Sales1" },
      },
      {
        _id: "2",
        fullName: "Ankit Verma",
        institution: "IIT Delhi",
        cohort: "2026",
        exceptionCount: 2,
        createdBy: { name: "Sales2" },
      },
      {
        _id: "3",
        fullName: "Priya Singh",
        institution: "IIT Bombay",
        cohort: "2027",
        exceptionCount: 3,
        createdBy: { name: "Sales1" },
      },
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setRole(decoded.role);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [institution, cohort]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard", {
        params: {
          institution,
          cohort,
        },
      });

      setSummary(res.data.summary);
      setCandidates(res.data.candidates);
    } catch (err) {
      console.log("Using demo data (API not ready)");
      setSummary(demoData.summary);
      setCandidates(demoData.candidates);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (count) => {
    if (count === 0) return "Low";
    if (count <= 2) return "Medium";
    return "High";
  };

  const riskBadge = (risk) => {
    if (risk === "Low") return "bg-green-100 text-green-600";
    if (risk === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Risk Dashboard</h1>

      {/* Filters (Admin & Moderator only) */}
      {(role === 0 || role === 1) && (
        <div className="flex gap-6 mb-8">
          <select
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option>All</option>
            <option>IIT Delhi</option>
            <option>IIT Bombay</option>
          </select>

          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option>All</option>
            <option>2026</option>
            <option>2027</option>
          </select>
        </div>
      )}

      {/* Loading */}
      {loading && <p className="mb-6 text-gray-500">Loading dashboard...</p>}

      {/* Risk Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Low Risk</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary.lowRisk}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Medium Risk</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {summary.mediumRisk}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">High Risk</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {summary.highRisk}
          </p>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-6">
          Candidates Risk List ({summary.total})
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-3">Name</th>
              <th>Institution</th>
              <th>Cohort</th>
              <th>Exceptions</th>
              <th>Risk</th>
              <th>Created By</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c) => {
              const risk = getRiskLevel(c.exceptionCount);
              return (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{c.fullName}</td>
                  <td>{c.institution}</td>
                  <td>{c.cohort}</td>
                  <td>{c.exceptionCount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${riskBadge(
                        risk
                      )}`}
                    >
                      {risk}
                    </span>
                  </td>
                  <td>{c.createdBy?.name || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default withAuth(Dashboard);