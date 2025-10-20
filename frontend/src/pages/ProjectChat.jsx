import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { authFetch } from "../utils/api";
import "./ProjectChat.css";

// Singleton socket to prevent double connections
let socket;

function ProjectChat() {
  const { id } = useParams(); // project ID
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔹 Initialize socket only once
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000"); // update URL if needed
    }
  }, []);

  // 🔹 Fetch user, project, and old messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await authFetch("/api/users/profile");
        const userData = await userRes.json();
        setUser(userData.user);

        const projRes = await authFetch(`/api/projects/${id}`);
        const projData = await projRes.json();
        setProject(projData);

        const msgRes = await authFetch(`/api/projects/${id}/messages`);
        const oldMessages = await msgRes.json();
        setMessages(
          oldMessages.map((m) => ({
            _id: m._id,
            user: m.sender.name,
            message: m.text,
            timestamp: m.createdAt,
          }))
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Join project room & listen for new messages
  useEffect(() => {
    if (!project || !user) return;

    socket.emit("joinProject", id);

    const handleMessage = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: msg._id,
          user: msg.user,
          message: msg.text,
          timestamp: msg.timestamp,
        },
      ]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [project, user, id]);

  // 🔹 Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    // Emit message to backend (backend will persist & broadcast)
    socket.emit("sendMessage", {
      projectId: id,
      senderId: user._id,
      message: text,
    });

    setText(""); // clear input
  };

  if (!project || !user) return <p>Loading...</p>;

  return (
    <div className="project-chat-container">
      <h2>{project.name} Chat</h2>

      <div className="members">
        <h3>Members</h3>
        <ul>
          {project.members.map((m) => (
            <li key={m._id}>
              {m.name} ({m.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-box">
        <div className="messages">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`message2 ${m.user === user.name ? "own" : ""}`}
            >
              <strong>{m.user}:</strong> {m.message}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* for auto-scroll */}
        </div>

        <div className="input-box">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;
