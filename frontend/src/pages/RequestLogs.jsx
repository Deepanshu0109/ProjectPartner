import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import "./Requests.css";

function RequestLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchLogs();
  }, []);

  if (loading) return <p className="loading-text">Loading request updates...</p>;

  return (
    <div className="requests-container">
      <h2 className="title">Request Updates</h2>

      {logs.length === 0 ? (
        <p className="no-logs">No updates yet</p>
      ) : (
        <div className="logs-list">
          {logs.map((log) => (
            <div key={log._id} className="request-card">
              <p className="action-text">{log.action || "No description"}</p>
              <small className="log-time">
                {new Date(log.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestLogs;
