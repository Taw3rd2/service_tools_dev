import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { googleAuth, logIn } from "../../firebase/firestore.utils";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { HourglassEmpty } from "@mui/icons-material";
import "./signin.css";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const logInWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logIn(email, password).then((res) => {
        setLoading(false);
        navigate("/homepage");
      });
    } catch {
      setLoading(false);
      alert("Your credentials are incorrect...");
    }
  };

  const logInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(googleAuth, provider)
      .then((res) => {
        setLoading(false);
        navigate("/homepage");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <div className="signIn">
      <div className="signInWrapper">
        <div className="signInLeft">
          <h3 className="signInLogo">Service Tools</h3>
          <span className="signInDescription">
            Tools build for Technicians, and Dispatchers!
          </span>
        </div>
        <div className="signInRight">
          <div className="signInBox">
            <form
              onSubmit={logInWithEmail}
              autoComplete="on"
              className="signInForm"
            >
              <input
                type="text"
                placeholder="Email"
                className="signInInput"
                autoComplete="current-email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="signInInput"
                autoComplete="current-password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="signInButton" type="submit">
                {loading ? <HourglassEmpty /> : `Sign In With Email`}
              </button>
              <span
                className="signInForgot"
                onClick={() => alert("Go look in the book...")}
              >
                Forgotten Password?
              </span>
            </form>
            <button
              type="button"
              className="signInWithGoogle"
              onClick={() => logInWithGoogle()}
              disabled
            >
              {loading ? <HourglassEmpty /> : `Sign In With Google`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
