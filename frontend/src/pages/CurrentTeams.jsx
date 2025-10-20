import { useEffect, useState } from "react";
import { fetchCurrentTeams } from "../utils/api";
import Navbar from "../components/Navbar";
import "./CurrentTeams.css";

function CurrentTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchCurrentTeams()
      .then(setTeams)
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="teams-page">
        <h2>Your Current Teams</h2>

        {teams.length === 0 ? (
          <p>You are not part of any team yet.</p>
        ) : (
          <div className="teams-list">
            {teams.map((team) => (
              <div key={team._id} className="team-card">
                <h3>{team.name}</h3>
                <p><strong>Created By:</strong> {team.createdBy?.name}</p>
                <p><strong>Description:</strong> {team.description}</p>
                <p><strong>Reason:</strong> {team.reason}</p>
                <p><strong>Teammates:</strong></p>
                <ul>
                  {team.members.map((member) => (
                    <li key={member._id}>{member.name} ({member.email})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CurrentTeams;
