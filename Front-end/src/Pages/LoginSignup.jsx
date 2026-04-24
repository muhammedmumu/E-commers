import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginSignup.css";
import { ShopContext } from "../Context/ShopContext";
import { requestJson } from "../utils/api";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage";

const LoginSignup = () => {
  const navigate = useNavigate();
  const { loginUser, backendStatus, isAuthenticated, currentUser } =
    useContext(ShopContext);
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const buttonLabel = useMemo(
    () =>
      isSubmitting ? "Please wait..." : state === "Login" ? "Login" : "Create Account",
    [isSubmitting, state]
  );

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const resetMessages = () => {
    setErrorMessage("");
    setInfoMessage("");
  };

  const getSavedUsers = () => readJSON(STORAGE_KEYS.users, []);

  const saveUserSession = (user) => {
    loginUser({
      token: `local-session-${Date.now()}`,
      user,
    });
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return "Email and password are required.";
    }

    if (state === "Sign Up" && !formData.username.trim()) {
      return "Your name is required for sign up.";
    }

    if (state === "Sign Up" && !agreed) {
      return "Please accept the terms to create an account.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.trim().length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return "";
  };

  const handleOfflineSignup = () => {
    const savedUsers = getSavedUsers();

    if (savedUsers.some((user) => user.email === formData.email.trim().toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: Date.now(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    writeJSON(STORAGE_KEYS.users, [...savedUsers, newUser]);
    saveUserSession({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
    setInfoMessage(
      "Backend is unavailable, so your account was created locally on this device."
    );
  };

  const handleOfflineLogin = () => {
    const savedUsers = getSavedUsers();
    const matchedUser = savedUsers.find(
      (user) =>
        user.email === formData.email.trim().toLowerCase() &&
        user.password === formData.password
    );

    if (!matchedUser) {
      throw new Error(
        "The backend is unavailable and no matching local account was found. Please sign up first."
      );
    }

    saveUserSession({
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
    });
    setInfoMessage(
      "Logged in with your locally saved account because the backend is unavailable."
    );
  };

  const handleSubmit = async () => {
    resetMessages();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (state === "Sign Up") {
        const response = await requestJson("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        });

        loginUser({
          token: response.token || `session-${Date.now()}`,
          user: response.user || {
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
          },
        });
      } else {
        const response = await requestJson("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        });

        loginUser({
          token: response.token || `session-${Date.now()}`,
          user: response.user || {
            username: formData.email.trim().split("@")[0],
            email: formData.email.trim().toLowerCase(),
          },
        });
      }

      navigate("/");
    } catch (error) {
      try {
        if (state === "Sign Up") {
          handleOfflineSignup();
        } else {
          handleOfflineLogin();
        }

        navigate("/");
      } catch (offlineError) {
        setErrorMessage(offlineError.message || error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <p className="loginsignup-subtitle">
          {state === "Login"
            ? "Access your saved cart and continue shopping."
            : "Create an account to save your cart and checkout faster."}
        </p>

        {isAuthenticated && currentUser ? (
          <div className="loginsignup-status">
            Signed in as {currentUser.username || currentUser.email}
          </div>
        ) : null}

        {backendStatus === "offline" ? (
          <div className="loginsignup-status warning">
            The live backend is currently unreachable. Login and sign up will work locally on this device.
          </div>
        ) : null}
        {backendStatus === "idle" ? (
          <div className="loginsignup-status warning">
            If the live backend is unavailable, this page automatically falls back to local demo mode.
          </div>
        ) : null}

        {errorMessage ? <div className="loginsignup-status error">{errorMessage}</div> : null}
        {infoMessage ? <div className="loginsignup-status success">{infoMessage}</div> : null}

        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your name"
            />
          ) : null}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>

        <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {buttonLabel}
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
                resetMessages();
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Need an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
                resetMessages();
              }}
            >
              Create one
            </span>
          </p>
        )}

        <label className="loginsignup-agree">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          <p>By continuing, I agree to the terms and privacy policy.</p>
        </label>
      </div>
    </div>
  );
};

export default LoginSignup;
