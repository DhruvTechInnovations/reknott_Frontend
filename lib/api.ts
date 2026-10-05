export type ApiResult<T = unknown> = {
  ok: boolean;
  demo: boolean;
  data?: T;
  message: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
console.log('apiBaseUrl', apiBaseUrl)

async function apiRequest<T>(method: "POST" | "PUT", path: string, body: Record<string, unknown>): Promise<ApiResult<T>> {

  console.log("inside the apiRequest function", apiBaseUrl)

  if (!apiBaseUrl) {
    console.log("inside the apiRequest function - no apiBaseUrl")
    return {
      ok: true,
      demo: true,
      message: "The form is ready. Connect NEXT_PUBLIC_API_URL to submit it to the ReKnott API.",
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => undefined)) as T | undefined;
    return {
      ok: response.ok,
      demo: false,
      data,
      message: response.ok ? "Thank you. Your information was submitted securely." : "We could not complete that request. Please try again.",
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      ok: false,
      demo: false,
      message: "Unable to connect to the backend server. Please check if the API is running on http://localhost:4000.",
    };
  }
}

export function apiPost<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("POST", path, body);
}

export function apiPut<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("PUT", path, body);
}
