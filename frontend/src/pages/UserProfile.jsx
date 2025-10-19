import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/api";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Specialization: {user.specialization}</p>
      <p>Semester: {user.semester}</p>
      <p>Skills: {(user.skills || []).join(", ")}</p>
      <p>Interests: {(user.interests || []).join(", ")}</p>
    </div>
  );
}

export default UserProfile;
