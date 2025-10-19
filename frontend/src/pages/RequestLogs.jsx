import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import "./Requests.css"; // reuse styles

function RequestLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await authFetch("/api/activity/request-logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching request logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading request updates...</p>;

  return (
    <div className="requests-container">
      <h2>Request Updates</h2>
      {logs.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className="request-card">
            <p>{log.action}</p>
            <small>{new Date(log.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default RequestLogs;
