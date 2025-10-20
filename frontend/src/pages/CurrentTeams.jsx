import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentTeams } from "../utils/api";
import Navbar from "../components/Navbar";
import "./CurrentTeams.css";

function CurrentTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await fetchCurrentTeams();
        // ✅ Make sure creator is included in members array
        const updatedTeams = data.map((team) => {
          const isCreatorInMembers = team.members.some(
            (m) => m._id === team.createdBy._id
          );
          if (!isCreatorInMembers) {
            return { ...team, members: [team.createdBy, ...team.members] };
          }
          return team;
        });
        setTeams(updatedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    getTeams();
  }, []);

  const handleTeamClick = (teamId) => {
    navigate(`/projects/${teamId}/chat`);
  };

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
              <div
                key={team._id}
                className="team-card"
                onClick={() => handleTeamClick(team._id)}
                style={{ cursor: "pointer" }}
              >
                <h3>{team.name}</h3>
                <p>
                  <strong>Created By:</strong> {team.createdBy?.name} ({team.createdBy?.email})
                </p>
                <p><strong>Description:</strong> {team.description}</p>
                <p><strong>Reason:</strong> {team.reason}</p>
                <p><strong>Teammates:</strong></p>
                <ul>
                  {team.members.map((member) => (
                    <li key={member._id}>
                      {member.name} ({member.email})
                      {member._id === team.createdBy._id ? " (Owner)" : ""}
                    </li>
                  ))}
                </ul>
                <p style={{ fontStyle: "italic", color: "#555" }}>
                  Click to open project chat
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CurrentTeams;
