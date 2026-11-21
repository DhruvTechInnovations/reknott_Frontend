import type { Metadata } from "next";
import { RegistrationWizard } from "@/components/interactive";

export const metadata: Metadata = { title: "Create Your Profile", description: "Create a detailed, private ReKnott profile for companionship after an earlier marital journey." };

export default function RegisterPage() {
  return <main>
    <section className="page-hero"><div className="container page-hero-grid"><div><div className="breadcrumb">Home / Create profile</div><span className="eyebrow">A private beginning for your next chapter</span><h1>Meet people who understand what it means to <span className="gradient-text">build companionship again.</span></h1><p>ReKnott is only for people whose earlier marriage has concluded and who are legally ready to move forward. Your profile remains private until KYC, legal eligibility and activation review are complete.</p></div><div className="page-hero-symbol" aria-hidden="true">♥</div></div></section>
    <section className="section section-blush"><div className="container form-layout"><aside className="form-aside"><span className="eyebrow" style={{ color: "#ff99b6" }}>Profile and trust guidance</span><h2>Honest is better than perfect.</h2><p>Share enough context for meaningful matching without placing unnecessary sensitive information in your public profile.</p><ul className="aside-list">{["Save every section as a private draft", "Complete KYC before activation", "Use the secure legal-document review path", "Choose public and protected details", "Select self-service or RM support", "Pause or change visibility later"].map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul><p style={{ marginTop: 23, fontSize: ".73rem", color: "#cdbbc7" }}>Never send identity or legal documents through a general email or support form. Upload them only through the secure document step in your profile.</p></aside><RegistrationWizard /></div></section>
  </main>;
}
