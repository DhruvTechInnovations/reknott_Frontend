"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function DemoLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to sign in.");
      window.location.assign("/member");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
      setBusy(false);
    }
  }

  return (
    <div className="demo-login-wrap simple-login-card">
      <form className="demo-credential-form" onSubmit={signIn}>
        <div className="field">
          <label htmlFor="member-login">Username or email</label>
          <input className="control" id="member-login" value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" required placeholder="Enter your username or email" />
        </div>
        <div className="field">
          <div className="field-label-row"><label htmlFor="member-password">Password</label><Link href="/forgot-password">Reset password</Link></div>
          <input className="control" id="member-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required placeholder="Enter your password" />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? "Signing in..." : "Member login"}</button>
      </form>
      {error && <p className="demo-error" role="alert">{error}</p>}
      <p className="demo-login-note">Your account and conversations remain private to signed-in members.</p>
    </div>
  );
}
