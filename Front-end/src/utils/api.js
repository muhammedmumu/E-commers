import { API_BASE_URL } from "../config";

export const requestJson = async (path, options = {}) => {
  const {
    timeout = 8000,
    headers = {},
    body,
    ...restOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...restOptions,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      body,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        responseData?.errors ||
        responseData?.message ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return responseData;
  } finally {
    clearTimeout(timeoutId);
  }
};
