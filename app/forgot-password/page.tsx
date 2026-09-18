import type { Metadata } from "next";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { PasswordResetForm } from "@/components/password-reset-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reset Password", description: "Request help resetting your ReKnott member password." };

export default async function ForgotPasswordPage() {
  const platformUser = await getChatGPTUser();
  return (
    <main className="demo-auth-page">
      <div className="container demo-auth-container">
        <div className="demo-auth-intro"><span className="eyebrow">Account recovery</span><h1>Let us help you return to your ReKnott account.</h1><p>Enter your registered email. For this demonstration, the request is securely recorded for member support follow-up.</p></div>
        {platformUser ? <PasswordResetForm /> : <div className="chat-state"><h2>Secure sign-in is required</h2><p>Sign in securely before requesting account support.</p><a className="btn btn-primary" href={chatGPTSignInPath("/forgot-password")} target="_top">Sign in securely</a></div>}
      </div>
    </main>
  );
}
