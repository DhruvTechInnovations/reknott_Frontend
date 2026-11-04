"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { authLogin } from "@/lib/api";

type LoginTab = "password" | "otp";

export function MemberLoginForm() {
  const [tab, setTab] = useState<LoginTab>("password");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Status state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle credentials login
  async function handlePasswordSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!login.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setBusy(true);
    setError("");
    setSuccessNotice("");

    try {
      const result = await authLogin({
        type: "password",
        login: login.trim(),
        password,
      });

      if (!result.ok) {
        throw new Error(result.error ?? "Invalid credentials. Please verify your email and password.");
      }

      setSuccessNotice(`Welcome back, ${result.data?.user?.displayName ?? "Member"}! Opening dashboard...`);
      setTimeout(() => {
        window.location.assign("/member");
      }, 500);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in. Please verify your credentials.");
      setBusy(false);
    }
  }

  // Handle OTP request
  function handleSendOtp() {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setOtpSent(true);
    setCountdown(30);
    setSuccessNotice("Verification code sent to your registered mobile number.");
  }

  // Handle OTP sign in
  async function handleOtpSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (!otp || otp.length < 4) {
      setError("Please enter the 6-digit verification code sent to your mobile.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const result = await authLogin({
        type: "otp",
        phone,
        otp,
      });

      if (!result.ok) {
        throw new Error(result.error ?? "Invalid verification code. Please check and try again.");
      }

      setSuccessNotice(`Verified! Welcome, ${result.data?.user?.displayName ?? "Member"}. Entering portal...`);
      setTimeout(() => {
        window.location.assign("/member");
      }, 500);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Verification failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="login-card-container">
      {/* Tab Switcher */}
      <div className="login-tab-strip" role="tablist" aria-label="Sign in method">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "password"}
          className={`login-tab-btn ${tab === "password" ? "active" : ""}`}
          onClick={() => {
            setTab("password");
            setError("");
          }}
        >
          <Lock size={15} />
          <span>Email & Password</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "otp"}
          className={`login-tab-btn ${tab === "otp" ? "active" : ""}`}
          onClick={() => {
            setTab("otp");
            setError("");
          }}
        >
          <Smartphone size={15} />
          <span>Mobile OTP</span>
        </button>
      </div>

      {/* Tab 1: Password Form */}
      {tab === "password" && (
        <form className="auth-form" onSubmit={handlePasswordSignIn} noValidate>
          <div className="auth-field">
            <label htmlFor="member-login-input">Registered Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="member-login-input"
                type="email"
                className="auth-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={busy}
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-field-header">
              <label htmlFor="member-password-input">Password</label>
              <Link href="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="member-password-input"
                type={showPassword ? "text" : "password"}
                className="auth-input has-toggle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your account password"
                required
                disabled={busy}
              />
              <button
                type="button"
                className="auth-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-options-row">
            <label className="auth-remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Keep me signed in on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-login-submit"
            disabled={busy}
          >
            {busy ? (
              <span className="btn-loading-flex">
                <RefreshCw className="spinner" size={17} />
                <span>Signing in...</span>
              </span>
            ) : (
              <span className="btn-loading-flex">
                <span>Member Sign In</span>
                <ArrowRight size={17} />
              </span>
            )}
          </button>
        </form>
      )}

      {/* Tab 2: Mobile OTP Form */}
      {tab === "otp" && (
        <form className="auth-form" onSubmit={handleOtpSignIn} noValidate>
          <div className="auth-field">
            <label htmlFor="member-phone-input">Registered Mobile Number</label>
            <div className="auth-phone-row">
              <div className="auth-phone-prefix">
                <span>🇮🇳 +91</span>
              </div>
              <div className="auth-input-wrapper flex-grow">
                <Phone className="auth-input-icon" size={18} />
                <input
                  id="member-phone-input"
                  type="tel"
                  className="auth-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  disabled={busy}
                />
              </div>
            </div>
          </div>

          {otpSent ? (
            <div className="auth-field otp-reveal-section">
              <div className="auth-field-header">
                <label htmlFor="member-otp-input">6-Digit Verification Code</label>
                {countdown > 0 ? (
                  <span className="auth-resend-countdown">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    className="auth-resend-btn"
                    onClick={handleSendOtp}
                    disabled={busy}
                  >
                    Resend code
                  </button>
                )}
              </div>
              <div className="auth-input-wrapper">
                <KeyRound className="auth-input-icon" size={18} />
                <input
                  id="member-otp-input"
                  type="text"
                  inputMode="numeric"
                  className="auth-input auth-otp-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  disabled={busy}
                />
              </div>
              <p className="auth-hint success">
                ✓ Verification code sent to your registered mobile.
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary btn-block btn-login-submit"
            disabled={busy}
          >
            {busy ? (
              <span className="btn-loading-flex">
                <RefreshCw className="spinner" size={17} />
                <span>Verifying...</span>
              </span>
            ) : otpSent ? (
              <span className="btn-loading-flex">
                <span>Verify & Continue</span>
                <ArrowRight size={17} />
              </span>
            ) : (
              <span className="btn-loading-flex">
                <span>Send One-Time Password</span>
                <ArrowRight size={17} />
              </span>
            )}
          </button>
        </form>
      )}

      {error && (
        <div className="auth-alert error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {successNotice && (
        <div className="auth-alert success" role="status">
          <CheckCircle2 size={16} />
          <p>{successNotice}</p>
        </div>
      )}

      {/* Safety & Trust Assurance Strip */}
      <div className="auth-security-strip">
        <div className="auth-security-icon">
          <ShieldCheck size={18} />
        </div>
        <div className="auth-security-text">
          <strong>100% Confidential Matrimonial Network</strong>
          <p>
            Your photographs and contact details are private and never disclosed without your mutual consent.
          </p>
        </div>
      </div>

      {/* Register CTA */}
      <div className="auth-footer-prompt">
        <p>
          Not a member yet?{" "}
          <Link href="/register" className="auth-register-link">
            Create your profile <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
