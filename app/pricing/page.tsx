import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/interactive";

export const metadata: Metadata = {
  title: "Membership Plans & Personalised Matchmaking",
  description: "Compare plans for ReKnott's focused community of people seeking companionship after an earlier marital journey.",
};

const plans = [
  {
    name: "Explore",
    audience: "A private return to possibility",
    price: "₹0",
    period: "No expiry",
    description: "Build a complete profile and begin meeting others who also understand what it means to seek companionship again.",
    features: [
      "Profile activation after KYC and eligibility review",
      "Browse compatible member profiles",
      "Send up to 5 interests each month",
      "Respond to interests you receive",
      "Protected photo and visibility controls",
    ],
    cta: "Create free profile",
    recommended: false,
  },
  {
    name: "Connect",
    audience: "For members managing their own search",
    price: "₹3,499",
    period: "3 months",
    description: "Move from discovery to meaningful conversations with greater access and control, while managing the search yourself.",
    features: [
      "Everything in Explore",
      "Unlimited interests during the plan period",
      "Protected messaging after mutual interest",
      "Advanced filters and saved searches",
      "Priority member support",
    ],
    cta: "Choose Connect",
    recommended: false,
  },
  {
    name: "Personalised",
    audience: "The best balance of guidance and value",
    price: "₹18,999",
    period: "3 months",
    description: "Work with a named Relationship Manager who learns your priorities and keeps your search moving with your approval.",
    features: [
      "Everything in Connect",
      "One dedicated Relationship Manager",
      "Profile writing, positioning and regular refreshes",
      "Up to 8 curated introductions each month",
      "RM-led follow-ups and family coordination",
      "Weekly progress review and preference refinement",
    ],
    cta: "Choose Personalised",
    recommended: true,
  },
  {
    name: "Elite",
    audience: "For discreet, highly involved support",
    price: "₹44,999",
    period: "6 months",
    description: "A senior Relationship Manager leads a focused search, coordinates introductions and supports deeper due diligence.",
    features: [
      "Everything in Personalised",
      "Senior RM and detailed preference consultation",
      "Priority curation and active profile sourcing",
      "Conversation, family meeting and schedule coordination",
      "Up to 2 consent-based background checks",
      "Private fortnightly progress consultation",
    ],
    cta: "Request Elite consultation",
    recommended: false,
  },
] as const;

const comparison = [
  ["KYC and legal eligibility review", "Included", "Included", "Included", "Included"],
  ["Profile and photo privacy controls", "Included", "Included", "Included", "Included"],
  ["Interests", "5 monthly", "Unlimited", "Unlimited", "Unlimited"],
  ["Protected member messaging", "Respond only", "Included", "Included", "Included"],
  ["Advanced search and saved filters", "Basic", "Included", "Included", "Included"],
  ["Dedicated Relationship Manager", "Not included", "Not included", "Named RM", "Senior RM"],
  ["Profile managed with your approval", "Self-managed", "Self-managed", "Included", "Included"],
  ["Curated introductions", "Algorithmic", "Algorithmic", "Up to 8 monthly", "Priority curation"],
  ["Background check assistance", "Not included", "Not included", "Guidance", "Up to 2 checks"],
] as const;

const faqs: Array<[string, string]> = [
  ["Who are ReKnott plans designed for?", "Every plan is exclusively for adults whose earlier marriage has concluded and who are legally ready to seek committed companionship again. ReKnott is not intended for first-time marriage searches."],
  ["Is verification available only on paid plans?", "No. KYC and legal eligibility review are required before any ReKnott profile becomes active, regardless of plan. A member cannot pay to bypass the trust process."],
  ["What does KYC verify?", "KYC is intended to compare identity, age and photograph against an accepted government-issued identity method. It helps reduce impersonation and duplicate or fake accounts, but it does not verify every statement or guarantee a person's conduct."],
  ["Which legal-status documents may be requested?", "Depending on the member's circumstances, review may require a final divorce decree or other applicable court order, or an official spouse death certificate. Requirements remain subject to applicable law, appeal status and qualified legal review."],
  ["Can separation evidence activate a marriage-ready profile?", "Separation evidence may explain current circumstances, but it does not by itself establish legal eligibility to remarry. ReKnott should keep the profile private or restricted until the applicable legal eligibility review is complete."],
  ["What will my Relationship Manager do?", "Your RM learns your priorities, improves and updates your profile, curates introductions, follows up with prospects and families, and shares progress. Profile changes and outreach should happen only with your approval."],
  ["What does an Elite background check include?", "For up to two mutually shortlisted profiles, ReKnott can coordinate a consent-based, defined-scope check through an authorised provider. The scope, sources, consent and limitations are explained before a check begins. It is not covert surveillance."],
  ["Does verification guarantee a safe or successful marriage?", "No. Verification can reduce specific risks and confirm selected records, but it cannot guarantee character, compatibility, intentions, future behaviour or a marriage outcome. Members should continue independent due diligence and meet safely."],
];

export default function PricingPage() {
  return <main>
    <section className="page-hero pricing-hero"><div className="container page-hero-grid"><div><div className="breadcrumb">Home / Membership plans</div><span className="eyebrow">Support for people beginning again</span><h1>Choose the guidance that feels right for <span className="gradient-text">the life ahead.</span></h1><p>Every plan belongs to the same focused remarriage community. Every active member has an earlier marital journey and completes KYC and legal eligibility review. Membership changes the support you receive, never the standard of trust.</p><div className="pricing-hero-points"><span>✓ Focused community</span><span>✓ Verification included</span><span>✓ Your approval stays essential</span></div></div><div className="page-hero-symbol" aria-hidden="true">♥</div></div></section>

    <section className="section"><div className="container"><div className="text-center"><span className="eyebrow">Recommended launch plans</span><h2 className="section-title">Begin again freely or choose hands-on support.</h2><p className="section-copy">Personalised is our recommended plan for members who want one accountable person to guide the search without taking away their choice.</p></div><div className="pricing-grid">{plans.map((plan) => <article className={`pricing-card${plan.recommended ? " recommended" : ""}`} key={plan.name}>{plan.recommended && <div className="pricing-ribbon">Recommended</div>}<div className="pricing-card-head"><span className="pricing-audience">{plan.audience}</span><h2>{plan.name}</h2><div className="price"><strong>{plan.price}</strong><span>{plan.period}</span></div><p>{plan.description}</p></div><ul className="plan-features">{plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul><Link className={`btn ${plan.recommended ? "btn-primary" : "btn-secondary"} btn-block`} href={plan.name === "Elite" ? "/contact" : "/register"}>{plan.cta}</Link></article>)}</div><p className="pricing-terms">Recommended introductory pricing for launch planning. GST may apply. Final payment, renewal, cancellation and refund terms must be shown before checkout is enabled.</p></div></section>

    <section className="section section-blush"><div className="container"><div className="section-heading"><div><span className="eyebrow">Verification comes first</span><h2 className="section-title">Trust is a joining requirement, not an upgrade.</h2></div><p className="section-copy">The review process should be secure, purpose-limited and easy to understand. Documents are for authorised review, not public display.</p></div><div className="trust-process-grid"><TrustStep icon="01" title="Confirm the account">Verify email and mobile ownership, and confirm that the represented adult knows about the profile.</TrustStep><TrustStep icon="02" title="Complete KYC">Use a consent-based accepted identity method to review name, age and photograph.</TrustStep><TrustStep icon="03" title="Review eligibility">Submit the applicable final court record or official certificate for a restricted, human review.</TrustStep><TrustStep icon="04" title="Activate with clear badges">Show members exactly which checks were completed, without exposing documents or claiming certainty.</TrustStep></div><div className="eligibility-callout"><div className="eligibility-icon">!</div><div><strong>Important eligibility distinction</strong><p>Separation proof can provide context, but it should not be shown as proof that a person is legally free to remarry. Activation depends on applicable law and the final supporting document.</p></div><Link className="text-link" href="/safety">Read the full policy</Link></div></div></section>

    <section className="section"><div className="container"><div className="text-center"><span className="eyebrow">Compare benefits</span><h2 className="section-title">See what changes from plan to plan.</h2></div><div className="plan-table-wrap"><table className="plan-table"><thead><tr><th>Benefit</th><th>Explore</th><th>Connect</th><th className="recommended-column">Personalised</th><th>Elite</th></tr></thead><tbody>{comparison.map(([benefit, explore, connect, personalised, elite]) => <tr key={benefit}><td><strong>{benefit}</strong></td><td>{explore}</td><td>{connect}</td><td className="recommended-column">{personalised}</td><td>{elite}</td></tr>)}</tbody></table></div></div></section>

    <section className="section section-purple"><div className="container two-column"><div><span className="eyebrow">How assisted matchmaking works</span><h2 className="section-title">Human help, with your voice and consent intact.</h2><p className="section-copy">A Relationship Manager can organise the work, but does not make personal decisions for you. Every introduction, follow-up and profile change remains visible and subject to your approval.</p></div><div className="rm-principles"><div><span>♥</span><strong>One named RM</strong><p>A consistent person learns your preferences and context.</p></div><div><span>✓</span><strong>Approval before outreach</strong><p>No proposal or important profile change is made silently.</p></div><div><span>◉</span><strong>Private progress reviews</strong><p>Preferences evolve through scheduled, confidential conversations.</p></div></div></div></section>

    <section className="section" id="pricing-faq"><div className="container"><div className="text-center"><span className="eyebrow">Questions about plans and checks</span><h2 className="section-title">Know exactly what you are choosing.</h2></div><FaqList items={faqs} /></div></section>

    <section className="section-sm"><div className="container"><div className="cta-panel"><div className="cta-content"><div><h2>Not sure how much support you need?</h2><p>Start with a free private profile, or speak with the team before choosing Personalised or Elite.</p></div><div className="cta-actions"><Link className="btn btn-light" href="/register">Create free profile</Link><Link className="btn btn-ghost-light" href="/contact">Talk to plan support</Link></div></div></div></div></section>
  </main>;
}

function TrustStep({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return <article className="trust-step"><span>{icon}</span><h3>{title}</h3><p>{children}</p></article>;
}
