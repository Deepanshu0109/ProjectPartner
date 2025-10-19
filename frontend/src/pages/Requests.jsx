import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import "./Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await authFetch("/api/projects/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (projectId, userId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/accept/${userId}`, {
        method: "POST",
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (projectId, userId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/reject/${userId}`, {
        method: "POST",
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="requests-container">
      <h2>Pending Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div key={`${req.projectId}-${req.senderId}`} className="request-card">
            <p><strong>Project:</strong> {req.projectName}</p>
            <p><strong>From:</strong> {req.senderName} ({req.senderEmail})</p>
            <button onClick={() => handleAccept(req.projectId, req.senderId)}>
              Accept
            </button>
            <button onClick={() => handleReject(req.projectId, req.senderId)}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Requests;
