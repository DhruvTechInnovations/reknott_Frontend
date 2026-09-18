"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to submit the request.");
      setMessage(payload.message ?? "Your request has been recorded.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to submit the request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="demo-login-wrap simple-login-card">
      {message ? (
        <div className="reset-success" role="status"><span aria-hidden="true">✓</span><p>{message}</p></div>
      ) : (
        <form className="demo-credential-form" onSubmit={submit}>
          <div className="field"><label htmlFor="reset-email">Registered email</label><input className="control" id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="Enter your registered email" /></div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? "Submitting..." : "Request password reset"}</button>
        </form>
      )}
      {error && <p className="demo-error" role="alert">{error}</p>}
      <p className="demo-login-note"><Link href="/login">Back to member login</Link></p>
    </div>
  );
}
