import Link from "next/link";
import { ProfileCard, QuickSearch } from "@/components/interactive";
import { HeroPhotoStory } from "@/components/hero-photo-story";
import { profiles } from "@/lib/profiles";

export default function HomePage() {
  return <main>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-content"><span className="eyebrow">For lives ready to share the road again</span>
        {/* <h1>Life has more to give. Find someone who understands what came before and  */}
        <h1>A fresh chapter with
          <span className="gradient-text"> someone who understands.</span>
        </h1>
        <p className="hero-copy">
          ReKnott is built only for people whose earlier chapter of marriage
          has come to a close through life's circumstances. Here, every member
          brings lived experience and the hope of meaningful companionship again.
        </p>
        <QuickSearch />
        {/* <div className="hero-trust"><span><i>✓</i> KYC required</span><span><i>✓</i> Legal eligibility reviewed</span><span><i>✓</i> Consent-led contact</span></div> */}
      </div>
      <div className="hero-photo-wrap"><HeroPhotoStory /></div>
    </div></section>

    <section className="trust-strip" aria-label="ReKnott trust features"><div className="container trust-strip-grid">
      <TrustProof icon="ID" title="KYC for active profiles" text="Identity, age and photograph are reviewed" />
      <TrustProof icon="✓" title="Eligibility document review" text="Supporting legal-status records are checked" />
      <TrustProof icon="◉" title="Privacy by default" text="Documents stay hidden from other members" />
      <TrustProof icon="RM" title="A shared starting point" text="Every member understands beginning again" />
    </div></section>

    <section className="belief-band" aria-label="The ReKnott belief"><div className="container"><div className="belief-card"><span className="belief-icon" aria-hidden="true">🦋</span><div><span className="belief-label">The ReKnott belief</span><p><strong>The past is respected.</strong> The life ahead is still full of possibility. ReKnott brings together people who understand both.</p></div><Link className="belief-link" href="/about">Why ReKnott <span aria-hidden="true">♥</span></Link></div></div></section>

    {/* <section className="motivation-section"><div className="container"><div className="motivation-intro"><span className="eyebrow">For the life that still lies ahead</span><h2>The years ahead deserve warmth, laughter and someone beside you.</h2><p>Choosing companionship again does not erase the past. It honours the life already lived and gives the life that remains a shared direction.</p></div><div className="motivation-grid">
      <Motivation tag="Honour">What came before may always matter. The right new companion will respect it, not ask you to forget it.</Motivation>
      <Motivation tag="Spark" featured>Sometimes the next chapter begins quietly: with a conversation, a shared value or the feeling of being understood again.</Motivation>
      <Motivation tag="Together">Life still holds joyful days and difficult ones. A caring partner can be the steady light beside you through both.</Motivation>
    </div></div></section> */}

    <section className="section">
      <div className="container">
        <div className="text-center">
          <span className="eyebrow">Why ReKnott is different</span>
          <h2 className="section-title">A matrimony community where every member is beginning again.</h2>
          <p className="section-copy">
            Connect with members who value your past, respect your present, and share your goals for the future.
          </p>
        </div>
        <div className="browse-chips" style={{ justifyContent: "center" }}>{["Ready to build again", "With children", "Without children", "Working professionals", "Established lives", "NRI journeys", "Family-supported", "At your own pace"].map((item) => <Link className="browse-chip" href="/matches" key={item}>{item}</Link>)}</div></div></section>

    <section className="section section-blush"><div className="container"><div className="section-heading"><div><span className="eyebrow">Designed for lives shaped by experience</span><h2 className="section-title">Compatibility when beginning again needs more than biodata.</h2></div><p className="section-copy">ReKnott gives equal importance to the earlier journey, personal values, children, family responsibilities, emotional readiness and the future each person now wants.</p></div><div className="feature-grid">
      <Feature icon="01" title="Life-stage-aware profiles" link="/about" linkText="Why this matters →">Present your current life honestly: children, caregiving responsibilities, living arrangements and the role you want family to play.</Feature>
      <Feature icon="02" title="Intentional partner preferences" link="/how-it-works" linkText="Understand matching →">Separate non-negotiables from flexible preferences so compatible people are not lost to an overly rigid checklist.</Feature>
      <Feature icon="03" title="Privacy before visibility" link="/safety" linkText="Review privacy controls →">Keep your profile as a draft, restrict discovery, protect photos and reveal contact details only after mutual interest.</Feature>
    </div></div></section>

    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Sample matches</span><h2 className="section-title">Profiles with context, not just a photograph.</h2></div><Link className="btn btn-secondary" href="/matches">Explore all sample profiles</Link></div><div className="profile-grid">{profiles.slice(0, 3).map((profile) => <ProfileCard profile={profile} key={profile.id} />)}</div><p className="muted-note text-center">All profile names and details are fictional and shown only to demonstrate the experience.</p></div></section>

    <section className="section section-blush"><div className="container"><div className="text-center"><span className="eyebrow">A simple, considered process</span><h2 className="section-title">A private path for people beginning again.</h2></div><div className="steps" style={{ marginTop: 34 }}>{[
      ["Describe your life today", "Create a private profile around the person you are now, the journey behind you and the companionship you hope to build."],
      ["Complete required checks", "Confirm phone and KYC, then submit the applicable legal-status document for eligibility review."],
      ["Discover and shortlist", "Use basic or detailed preferences, save searches and privately shortlist compatible people."],
      ["Connect with consent", "Express interest, message after acceptance and share photos or contact information deliberately."],
    ].map(([title, text]) => <article className="step-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="text-center" style={{ marginTop: 29 }}><Link className="btn btn-primary" href="/how-it-works">See the complete member journey</Link></div></div></section>

    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Support for your next chapter</span><h2 className="section-title">Begin independently. Add human guidance when you want it.</h2></div><p className="section-copy">Every member belongs to the same focused remarriage community and follows the same KYC and eligibility standard. Paid plans add communication tools, a named Relationship Manager and, on Elite, consent-based background verification support.</p></div><div className="pricing-preview-grid">
      <PlanPreview name="Explore" price="Free" detail="Create a reviewed profile, browse compatible matches and send limited interests." />
      <PlanPreview name="Connect" price="₹3,499" detail="Three months of expanded interests, protected messaging and advanced discovery." />
      <PlanPreview name="Personalised" price="₹18,999" detail="Three months with a dedicated RM who manages your profile and introductions with your approval." recommended />
      <PlanPreview name="Elite" price="₹44,999" detail="Six months of senior RM support plus lawful, consent-based background check assistance." />
    </div><div className="pricing-preview-note"><span>Recommended launch pricing. GST as applicable.</span><Link className="btn btn-secondary" href="/pricing">Compare all plans</Link></div></div></section>

    {/* <section className="section"><div className="container two-column"><div className="photo-panel"><img src="/assets/hero-south-indian-date.png" alt="A South Indian couple sharing a relaxed conversation on a rooftop" /><div className="photo-panel-copy"><strong>A new bond can grow without diminishing the chapter before it.</strong><span>Honesty, care and mutual respect make space for two experienced lives to meet.</span></div></div><div><span className="eyebrow">A steady light for the road ahead</span><h2 className="section-title">The right companion can bring warmth, courage and possibility back into everyday life.</h2><p className="section-copy">Someone who has also lived through change may understand the quiet need for support, laughter and presence. Together, two people can honour what shaped them and still create something deeply their own.</p><ul className="check-list"><Check title="Family and home">living arrangements, responsibilities, boundaries and the future you imagine.</Check><Check title="Money and responsibilities">financial independence, dependants, assets and expectations.</Check><Check title="Family involvement">how and when parents, siblings or children participate.</Check><Check title="Emotional readiness">pace, communication, memories and the relationship you want to build.</Check></ul><div className="info-box"><strong>Your past needs no apology.</strong> The right person will respect it while helping the life ahead feel shared again.</div></div></div></section> */}

    <section className="section section-blush"><div className="container"><div className="section-heading"><div><span className="eyebrow">Safety and trust</span><h2 className="section-title">Required verification, explained clearly.</h2></div><p className="section-copy">A profile becomes active only after KYC and the applicable legal-status document have been reviewed. Each badge says what was checked, while sensitive documents remain private.</p></div><div className="feature-grid"><Feature icon="ID" title="KYC for every active member">Identity, age and photograph are checked against an accepted government-issued identity method.</Feature><Feature icon="✓" title="Legal eligibility review">Final court records or an official spouse death certificate are reviewed as applicable. Separation evidence alone does not confirm eligibility to remarry.</Feature><Feature icon="⚑" title="Ongoing reporting and support">Verification reduces impersonation and duplicate accounts, but members can still block, report and request human review.</Feature></div><div className="text-center" style={{ marginTop: 28 }}><Link className="btn btn-secondary" href="/safety">Read the complete verification guide</Link></div></div></section>

    <section className="section"><div className="container"><div className="text-center"><span className="eyebrow">New beginnings</span><h2 className="section-title">Stories should be shared only with consent.</h2><p className="section-copy">Until verified member stories are available, the website uses clearly marked illustrative examples rather than presenting invented testimonials as real.</p></div><div className="quote-grid" style={{ marginTop: 34 }}><Quote source="A family-aware beginning • Hyderabad">We first connected over the things that shaped our everyday lives: family, work and the kind of peaceful home we both wanted.</Quote><Quote source="A thoughtful connection • Chennai">I hoped to meet someone who could understand my journey and still imagine a joyful future with me.</Quote><Quote source="A values-first connection • Bengaluru">We spoke about important subjects early. The honesty gave us more confidence than any perfect profile could.</Quote></div></div></section>

    <CallToAction title="Your earlier chapter matters. So does everything still ahead." text="Create a private profile and meet people who understand what it means to welcome companionship again." />
  </main>;
}

function TrustProof({ icon, title, text }: { icon: string; title: string; text: string }) { return <div className="trust-proof"><div className="trust-proof-icon">{icon}</div><div><strong>{title}</strong><span>{text}</span></div></div>; }
function Motivation({ tag, featured = false, children }: { tag: string; featured?: boolean; children: React.ReactNode }) { return <article className={`motivation-card${featured ? " featured" : ""}`}><span>{tag}</span><blockquote>{children}</blockquote></article>; }
function PlanPreview({ name, price, detail, recommended = false }: { name: string; price: string; detail: string; recommended?: boolean }) { return <article className={`plan-preview${recommended ? " recommended" : ""}`}>{recommended && <span className="plan-preview-badge">Recommended</span>}<h3>{name}</h3><strong>{price}</strong><p>{detail}</p></article>; }
function Feature({ icon, title, link, linkText, children }: { icon: string; title: string; link?: string; linkText?: string; children: React.ReactNode }) { return <article className="feature-card">{icon && <div className="icon-box">{icon}</div>}<h3>{title}</h3><p>{children}</p>{link && <Link className="text-link" href={link}>{linkText}</Link>}</article>; }
function Check({ title, children }: { title: string; children: React.ReactNode }) { return <li><span className="check">✓</span><span><strong>{title}:</strong> {children}</span></li>; }
function Quote({ source, children }: { source: string; children: React.ReactNode }) { return <article className="quote-card"><span className="sample-label">Illustrative story</span><div className="quote-mark">“</div><blockquote>{children}</blockquote><div className="quote-source">{source}</div></article>; }
function CallToAction({ title, text }: { title: string; text: string }) { return <section className="section-sm"><div className="container"><div className="cta-panel"><div className="cta-content"><div><h2>{title}</h2><p>{text}</p></div><div className="cta-actions"><Link className="btn btn-light" href="/register">Create my profile</Link><Link className="btn btn-ghost-light" href="/contact">Talk to support</Link></div></div></div></div></section>; }
