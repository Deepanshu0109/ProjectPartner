import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero-illustration.png";
import "./Landing.css";

function Landing() {
  return (
    <>
      <Navbar />

      {/* === HERO SECTION === */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Find Your Perfect <span className="highlight">Project Partner</span>
            </h1>
            <p>
              Collaborate, innovate, and bring your ideas to life with like-minded
              students!
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                🚀 Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                🔑 Login
              </Link>
            </div>
          </div>

          <div className="hero-illustration">
            <img
              src=  {heroImg}
              alt="Students collaborating"
            />
          </div>
        </div>
      </header>

      {/* === FEATURES SECTION === */}
      <section className="features">
        <h2>
          Why Choose <span className="highlight">ProjectPartner?</span>
        </h2>
        <div className="feature-cards">
          <div className="card">
            <h3>🧑‍💻 Find Talented Teammates</h3>
            <p>Browse through skilled individuals to join your dream project.</p>
          </div>
          <div className="card">
            <h3>💡 Share Your Ideas</h3>
            <p>Post your project idea and attract the right collaborators.</p>
          </div>
          <div className="card">
            <h3>⚡ Work Seamlessly</h3>
            <p>Stay connected and manage your project with ease.</p>
          </div>
        </div>
      </section>

      {/* === ABOUT SECTION === */}
      <section className="about">
        <h2>
          About <span className="highlight">ProjectPartner</span>
        </h2>
        <p>
          ProjectPartner is an academic platform designed to help students
          connect with like-minded peers for collaborative projects. Whether you
          have an idea to share or are looking to join a team, our platform
          streamlines the process of finding the right partners.
        </p>
      </section>

      {/* === HOW IT WORKS SECTION === */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Sign Up</h3>
            <p>Create your account in seconds.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Post or Search Projects</h3>
            <p>Find collaborators or share your idea.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Collaborate</h3>
            <p>Work together and bring your idea to life.</p>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="footer">
        <div className="footer-content">
          <h3>ProjectPartner</h3>
          <p>Connecting students for collaborative success.</p>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">GitHub Repo</a>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} ProjectPartner | Developed by{" "}
            <span className="dev-name">Dev4</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Landing;
