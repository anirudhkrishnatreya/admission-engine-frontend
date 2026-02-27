import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import withAuth from "../utils/withAuth";
import API from "../utils/api";
import ReportsTable from "../components/ReportsTable";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";
import { useToast } from "../components/ToastContext";

function Reports() {
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/candidates");
      setData(res.data);
    } catch (err) {
      showToast("Failed to fetch reports", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    exportToCSV(data, "admission_reports");
  };

  const handleExportExcel = () => {
    exportToExcel(data, "admission_reports");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:opacity-90"
          >
            Export CSV
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90"
          >
            Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReportsTable data={data} />
      )}
    </Layout>
  );
}

export default withAuth(Reports);