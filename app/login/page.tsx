import type { Metadata } from "next";
import Link from "next/link";
import { MemberLoginForm } from "@/components/member-login-form";
import { ShieldCheck, Heart, UserCheck, Lock, Sparkles, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Login | ReKnott Matrimony",
  description:
    "Sign in to your private ReKnott account to explore compatible profiles, manage privacy preferences, and connect with verified members ready for a new beginning.",
};

export default function LoginPage() {
  return (
    <main className="member-auth-page">
      <div className="container member-auth-container">
        {/* Left Column: Brand Context & Trust Guidance */}
        <section className="member-auth-intro">
          <div className="auth-breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Member Login</span>
          </div>

          <div className="auth-eyebrow-pill">
            <Heart size={14} className="auth-heart-icon" />
            <span>Confidential & Verified Member Space</span>
          </div>

          <h1 className="auth-title">
            Your profile, preferences and conversations in{" "}
            <span className="gradient-text">one secure place.</span>
          </h1>

          <p className="auth-subtitle">
            ReKnott is dedicated to people whose earlier marital journey has concluded
            and who are ready to build a meaningful, lasting companionship again.
          </p>

          <div className="auth-pillars">
            <div className="auth-pillar-card">
              <div className="pillar-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="pillar-content">
                <strong>Legal Eligibility Verified</strong>
                <p>
                  Profiles are reviewed for legal status (divorce decree, death certificate, or court order) before activation.
                </p>
              </div>
            </div>

            <div className="auth-pillar-card">
              <div className="pillar-icon">
                <Lock size={20} />
              </div>
              <div className="pillar-content">
                <strong>Complete Privacy Protection</strong>
                <p>
                  You choose who sees your photographs and personal background. No contact details are shared without mutual consent.
                </p>
              </div>
            </div>

            <div className="auth-pillar-card">
              <div className="pillar-icon">
                <UserCheck size={20} />
              </div>
              <div className="pillar-content">
                <strong>Thoughtful Match Ranking</strong>
                <p>
                  Compatibility scores reflect shared values, family openness, children considerations, and mutual readiness.
                </p>
              </div>
            </div>
          </div>

          <div className="auth-quote-card">
            <p>
              &ldquo;The past is respected. The life ahead is still full of possibility. ReKnott brings together people who understand both.&rdquo;
            </p>
            <span className="auth-quote-author">— ReKnott Community Commitment</span>
          </div>

          <div className="auth-support-note">
            <HelpCircle size={15} />
            <span>
              Need assistance?{" "}
              <Link href="/contact">Contact Relationship Manager</Link> or visit our{" "}
              <Link href="/safety">Safety & Privacy Centre</Link>.
            </span>
          </div>
        </section>

        {/* Right Column: Member Login Form Card */}
        <section className="member-auth-form-column" aria-label="Sign in to your member account">
          <div className="auth-card-top-header">
            <span className="auth-card-kicker">Member Access</span>
            <h2>Sign in to ReKnott</h2>
            <p>Access your dashboard, ranked matches and private conversations.</p>
          </div>

          <MemberLoginForm />
        </section>
      </div>
    </main>
  );
}
