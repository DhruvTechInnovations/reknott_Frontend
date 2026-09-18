import type { Metadata } from "next";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { DemoLogin } from "@/components/demo-login";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Member Login",
  description: "Sign in to manage your ReKnott profile, preferences, photographs and conversations.",
};

export default async function LoginPage() {
  const platformUser = await getChatGPTUser();
  return (
    <main className="demo-auth-page">
      <div className="container demo-auth-container">
        <div className="demo-auth-intro">
          <span className="eyebrow">Private member access</span>
          <h1>Your profile, preferences and conversations in one secure place.</h1>
          <p>Sign in to manage your profile, add photographs, review ranked matches and continue private conversations.</p>
        </div>
        {platformUser ? (
          <DemoLogin />
        ) : (
          <div className="chat-state">
            <h2>Secure sign-in is required</h2>
            <p>Sign in securely before entering your ReKnott member credentials.</p>
            <a className="btn btn-primary" href={chatGPTSignInPath("/login")} target="_top">Sign in securely</a>
          </div>
        )}
      </div>
    </main>
  );
}
