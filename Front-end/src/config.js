const envApiUrl = process.env.REACT_APP_API_URL?.trim();
const localApiUrl = "http://localhost:4000";
const productionApiUrl = "https://e-commers-zter.vercel.app";

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const selectedApiUrl =
  envApiUrl || (isLocalHost ? localApiUrl : productionApiUrl);

export const API_BASE_URL = selectedApiUrl.replace(/\/+$/, "");
