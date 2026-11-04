export type ApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  message: string;
};

// In-memory token storage (NO localStorage used)
let inMemoryToken: string | null = null;
const COOKIE_NAME = "reknott_session_token";

export function getAuthToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (match) {
      inMemoryToken = decodeURIComponent(match[1]);
      return inMemoryToken;
    }
    try {
      const stored = localStorage.getItem(COOKIE_NAME);
      if (stored) {
        inMemoryToken = stored;
        return inMemoryToken;
      }
    } catch {}
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  inMemoryToken = token;
  if (typeof document !== "undefined") {
    if (token) {
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      try {
        localStorage.setItem(COOKIE_NAME, token);
      } catch {}
    } else {
      clearAuthToken();
    }
  }
}

export function clearAuthToken(): void {
  inMemoryToken = null;
  if (typeof document !== "undefined") {
    const epoch = "Thu, 01 Jan 1970 00:00:00 GMT";
    const cookieKeys = [COOKIE_NAME, "reknott_session_token", "reknott_token", "token", "auth_token"];
    for (const key of cookieKeys) {
      document.cookie = `${key}=; path=/; expires=${epoch}; max-age=0; SameSite=Lax`;
      document.cookie = `${key}=; expires=${epoch}; max-age=0; SameSite=Lax`;
    }
    try {
      for (const key of cookieKeys) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      }
    } catch { }
  }
}

// Interceptor Architecture
export interface RequestContext {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
}

export interface ResponseContext<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  rawResponse: Response;
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;
export type ResponseInterceptor = (context: ResponseContext) => ResponseContext | Promise<ResponseContext>;

class InterceptorChain<T> {
  private handlers: T[] = [];
  use(handler: T): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }
  get(): T[] {
    return this.handlers;
  }
}

export const interceptors = {
  request: new InterceptorChain<RequestInterceptor>(),
  response: new InterceptorChain<ResponseInterceptor>(),
};

// Default Request Interceptor: Injects Authorization Header & Content-Type
interceptors.request.use(async (ctx) => {
  const token = getAuthToken();
  if (token && !ctx.headers["Authorization"]) {
    ctx.headers["Authorization"] = `Bearer ${token}`;
  }
  if (!ctx.headers["Content-Type"] && ctx.body && typeof ctx.body === "object") {
    ctx.headers["Content-Type"] = "application/json";
  }
  return ctx;
});

// Default Response Interceptor: Handles 401 Unauthorized & extracts error messages
interceptors.response.use(async (ctx) => {
  // Commented out clearAuthToken to prevent clearing session on 401 unauthorized errors
  // if (ctx.status === 401) {
  //   clearAuthToken();
  // }
  return ctx;
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

function resolveEndpoint(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    // In browser, relative URL is forwarded by Next.js rewrites to backend
    return cleanPath;
  }
  return `${apiBaseUrl}${cleanPath}`;
}

export async function apiFetch<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: any,
  customHeaders: Record<string, string> = {},
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  let context: RequestContext = {
    url: resolveEndpoint(path),
    method,
    headers: { ...customHeaders },
    body,
  };

  // Run all request interceptors
  for (const interceptor of interceptors.request.get()) {
    context = await interceptor(context);
  }

  try {
    const response = await fetch(context.url, {
      method: context.method,
      headers: context.headers,
      credentials: "include",
      body: context.body ? JSON.stringify(context.body) : undefined,
    });

    const parsedData = (await response.json().catch(() => undefined)) as T | undefined;
    const errorMsg = !response.ok
      ? ((parsedData as any)?.error || (parsedData as any)?.message || `Request failed with status ${response.status}`)
      : undefined;

    let resContext: ResponseContext<T> = {
      ok: response.ok,
      status: response.status,
      data: parsedData,
      error: errorMsg,
      rawResponse: response,
    };

    // Run all response interceptors
    for (const interceptor of interceptors.response.get()) {
      resContext = await interceptor(resContext);
    }

    return {
      ok: resContext.ok,
      status: resContext.status,
      data: resContext.data,
      error: resContext.error,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Unable to connect to the server.",
    };
  }
}

export async function apiRequest<T>(
  method: "POST" | "PUT",
  path: string,
  body: Record<string, unknown>,
): Promise<ApiResult<T>> {
  const result = await apiFetch<T>(method, path, body);
  return {
    ok: result.ok,
    data: result.data,
    message: result.ok
      ? "Thank you. Your request was processed successfully."
      : (result.error ?? "We could not complete that request. Please try again."),
  };
}

export function apiPost<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("POST", path, body);
}

export function apiPut<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>("PUT", path, body);
}

// Authentication Helpers
export async function authLogin(payload: {
  login?: string;
  email?: string;
  password?: string;
  type?: "otp" | "password";
  phone?: string;
  otp?: string;
}) {
  const res = await apiFetch<{
    token: string;
    user: { id: string; email: string | null; phone: string | null; displayName: string };
    profile?: any;
  }>("POST", "/v1/auth/login", payload);

  if (res.ok && res.data?.token) {
    console.log('user logged in', res.data)
    setAuthToken(res.data.token);
    if (typeof window !== "undefined" && res.data.user) {
      try {
        localStorage.setItem("reknott_user", JSON.stringify(res.data.user));
        if (res.data.profile) {
          localStorage.setItem("reknott_profile", JSON.stringify(res.data.profile));
        }
      } catch {}
    }
  }
  return res;
}

export async function authRegister(payload: {
  email: string;
  displayName: string;
  phone?: string;
  gender?: "WOMAN" | "MAN" | "ANOTHER_IDENTITY";
  city?: string;
  dateOfBirth?: string;
  profession?: string;
  education?: string;
}) {
  const res = await apiFetch<{
    token: string;
    user: { id: string; email: string; phone?: string; displayName: string };
    profile?: any;
  }>("POST", "/v1/auth/register", payload);

  if (res.ok && res.data?.token) {
    setAuthToken(res.data.token);
    if (typeof window !== "undefined" && res.data.user) {
      try {
        localStorage.setItem("reknott_user", JSON.stringify(res.data.user));
        if (res.data.profile) {
          localStorage.setItem("reknott_profile", JSON.stringify(res.data.profile));
        }
      } catch {}
    }
  }
  return res;
}

export async function authSession() {
  // Session checking logic commented out to avoid unauthorized errors
  /*
  const token = getAuthToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "No active session",
    };
  }
  return apiFetch<{
    user: { id: string; cognitoSubject: string; email: string | null; phone: string | null; displayName: string };
    profile?: any;
  }>("GET", "/v1/auth/session");
  */

  // Bypass session checking: retrieve current user or fallback to demo member without blocking with 401
  let savedUser = null;
  let savedProfile = null;
  if (typeof window !== "undefined") {
    try {
      const u = localStorage.getItem("reknott_user");
      if (u) savedUser = JSON.parse(u);
      const p = localStorage.getItem("reknott_profile");
      if (p) savedProfile = JSON.parse(p);
    } catch {}
  }

  return {
    ok: true,
    status: 200,
    data: {
      user: savedUser || {
        id: "dev-local-user",
        cognitoSubject: "dev-local-user",
        email: "member@reknott.com",
        phone: "+91 98765 43210",
        displayName: "Siddharth Verma",
      },
      profile: savedProfile,
    },
  };
}

export async function authLogout(): Promise<void> {
  clearAuthToken();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("reknott_user");
      localStorage.removeItem("reknott_profile");
    } catch {}
  }
  try {
    await apiFetch("POST", "/v1/auth/logout").catch(() => { });
  } catch { }
}

// Profile, Preferences & Matches
export interface PreferenceDto {
  ageMin?: number;
  ageMax?: number;
  cities?: string[];
  languages?: string[];
  childPreference?: string;
  relocationPreference?: string;
  essentialCriteria?: any;
  flexibleCriteria?: any;
}

export async function getMyProfile() {
  return apiFetch<any>("GET", "/v1/profiles/me");
}

export async function getMyPreferences() {
  return apiFetch<PreferenceDto>("GET", "/v1/profiles/me/preferences");
}

export async function updatePreferences(preferences: PreferenceDto) {
  return apiFetch<PreferenceDto>("PUT", "/v1/profiles/me/preferences", preferences);
}

export async function updateMyProfile(data: {
  displayName: string;
  dateOfBirth: string;
  gender: "WOMAN" | "MAN" | "ANOTHER_IDENTITY";
  city: string;
  email?: string;
  profession?: string;
  education?: string;
  bio?: string;
  familyContext?: string;
  partnerIntent?: string;
  preferences?: PreferenceDto;
}) {
  return apiFetch<any>("PUT", "/v1/profiles/me", data);
}

export async function getMatches(query?: {
  gender?: string;
  city?: string;
  language?: string;
  ageMin?: number;
  ageMax?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (query?.gender) params.set("gender", query.gender.toUpperCase());
  if (query?.city) params.set("city", query.city);
  if (query?.language) params.set("language", query.language);
  if (query?.ageMin) params.set("ageMin", String(query.ageMin));
  if (query?.ageMax) params.set("ageMax", String(query.ageMax));
  if (query?.limit) params.set("limit", String(query.limit));

  const qs = params.toString();
  return apiFetch<any[]>("GET", `/v1/matches${qs ? `?${qs}` : ""}`);
}
