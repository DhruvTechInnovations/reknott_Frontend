import type { Metadata } from "next";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { PasswordResetForm } from "@/components/password-reset-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reset Password", description: "Request help resetting your ReKnott member password." };

export default function ForgotPasswordPage() {
  return (
    <main className="demo-auth-page">
      <div className="container demo-auth-container">
        <div className="demo-auth-intro">
          <span className="eyebrow">Account recovery</span>
          <h1>Let us help you return to your ReKnott account.</h1>
          <p>Enter your registered email address. A password recovery request will be processed securely for your account.</p>
        </div>
        <PasswordResetForm />
      </div>
    </main>
  );
}
