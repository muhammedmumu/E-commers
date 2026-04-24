import React, { useState } from "react";
import "./NewsLetter.css";
import { STORAGE_KEYS } from "../../utils/storage";

export const NewsLetter = () => {
  const [email, setEmail] = useState(localStorage.getItem(STORAGE_KEYS.newsletter) || "");
  const [message, setMessage] = useState("");

  const handleSubscribe = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Enter a valid email address to subscribe.");
      return;
    }

    localStorage.setItem(STORAGE_KEYS.newsletter, email);
    setMessage("Subscription saved. You will keep this email locally for the demo.");
  };

  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div className="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
      {message ? <span className="newsletter-message">{message}</span> : null}
    </div>
  );
};
