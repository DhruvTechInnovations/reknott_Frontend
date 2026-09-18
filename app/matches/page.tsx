import type { Metadata } from "next";
import Link from "next/link";
import { MatchesExplorer } from "@/components/interactive";

export const metadata: Metadata = { title: "Explore Matches", description: "Explore sample profiles of people ready to begin companionship again, with thoughtful filters for family, life stage and values." };

export default function MatchesPage() {
  return <main>
    <section className="page-hero"><div className="container page-hero-grid"><div><div className="breadcrumb">Home / Explore matches</div><span className="eyebrow">A shared understanding from the start</span><h1>Meet people who also believe <span className="gradient-text">life can feel shared again.</span></h1><p>Every future active member will have an earlier marital journey and completed KYC and eligibility review. Explore practical filters alongside family, life-stage and partnership details. These profiles are fictional demonstrations.</p></div><div className="page-hero-symbol" aria-hidden="true">⌕</div></div></section>
    <section className="section section-blush"><div className="container"><MatchesExplorer /></div></section>
    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Search with care</span><h2 className="section-title">Compatibility is broader than a filter result.</h2></div><p className="section-copy">Preferences can improve relevance, but conversation and independent verification are still essential.</p></div><div className="feature-grid"><Guidance title="Use essential filters sparingly">Overly narrow criteria may hide compatible people. Mark cultural, lifestyle and location preferences as essential only when they truly are.</Guidance><Guidance title="Read the complete profile">Look beyond photographs and job titles. Family context, communication style and future expectations often matter more.</Guidance><Guidance title="Verify before commitment">Review badges are useful signals, not guarantees. Independently confirm every important legal, personal and financial claim.</Guidance></div></div></section>
    <section className="section-sm"><div className="container"><div className="cta-panel"><div className="cta-content"><div><h2>Meet someone who understands both the story behind you and the life ahead.</h2><p>Create a complete private profile and find similar-minded people who are also ready to build again.</p></div><div className="cta-actions"><Link className="btn btn-light" href="/register">Create profile</Link><Link className="btn btn-ghost-light" href="/how-it-works">How matching works</Link></div></div></div></div></section>
  </main>;
}
function Guidance({ title, children }: { title: string; children: React.ReactNode }) { return <article className="feature-card"><h3>{title}</h3><p>{children}</p></article>; }
