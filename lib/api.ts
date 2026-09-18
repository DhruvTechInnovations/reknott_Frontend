export type ApiResult<T = unknown> = {
  ok: boolean;
  demo: boolean;
  data?: T;
  message: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function apiRequest<T>(method: "POST" | "PUT", path: string, body: Record<string, unknown>): Promise<ApiResult<T>> {
  if (!apiBaseUrl) {
    return {
      ok: true,
      demo: true,
      message: "The form is ready. Connect NEXT_PUBLIC_API_URL to submit it to the ReKnott API.",
    };
  }

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
}

export function apiPost<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("POST", path, body);
}

export function apiPut<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("PUT", path, body);
}
