import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import withAuth from "../utils/withAuth";
import API from "../utils/api";
import ApplicationForm from "../components/ApplicationForm";
import { useToast } from "../components/ToastContext";

function Applications() {
  const { showToast } = useToast();

  const [configs, setConfigs] = useState([]);
  const [institution, setInstitution] = useState("");
  const [cohort, setCohort] = useState("");
  const [activeConfig, setActiveConfig] = useState(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await API.get("/cohort-config");
      setConfigs(res.data);
    } catch (err) {
      showToast("Failed to load configurations", "error");
    }
  };

  const handleSave = async (data) => {
    try {
      await API.post("/candidates", data);
      showToast("Application saved successfully");
    } catch (err) {
      showToast("Failed to save application", "error");
    }
  };

  // Unique institutions
  const institutions = [
    ...new Set(configs.map((c) => c.institution)),
  ];

  // Filter cohorts by institution
  const cohorts = configs
    .filter((c) => c.institution === institution)
    .map((c) => c.cohort);

  useEffect(() => {
    if (institution && cohort) {
      fetchActiveConfig();
    } else {
      setActiveConfig(null);
    }
  }, [institution, cohort]);

  const fetchActiveConfig = async () => {
    try {
      const res = await API.get(
        `/cohort-config?institution=${institution}&cohort=${cohort}`
      );

      if (!res.data) {
        showToast(
          "Eligibility config not defined for this cohort.",
          "error"
        );
        setActiveConfig(null);
      } else {
        setActiveConfig(res.data);
      }
    } catch (err) {
      showToast("Failed to fetch config", "error");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">
        Application Review Console
      </h1>

      {/* Selection Panel */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">
            University
          </label>
          <select
            value={institution}
            onChange={(e) =>
              setInstitution(e.target.value)
            }
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select University</option>
            {institutions.map((inst) => (
              <option key={inst}>{inst}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Cohort
          </label>
          <select
            value={cohort}
            onChange={(e) =>
              setCohort(e.target.value)
            }
            className="w-full p-3 border rounded-xl"
            disabled={!institution}
          >
            <option value="">Select Cohort</option>
            {cohorts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {activeConfig ? (
        <ApplicationForm
          institution={institution}
          cohort={cohort}
          config={activeConfig}
          onSave={handleSave}
        />
      ) : (
        institution &&
        cohort && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl">
            No eligibility configuration found.
          </div>
        )
      )}
    </Layout>
  );
}

export default withAuth(Applications);