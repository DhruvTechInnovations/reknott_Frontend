import Link from "next/link";
import { ProfileCard, QuickSearch } from "@/components/interactive";
import { HeroPhotoStory } from "@/components/hero-photo-story";
import { profiles } from "@/lib/profiles";

export default function HomePage() {
  return <main>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-content"><span className="eyebrow">Remarriage, with hope and dignity</span>
        <h1>Your story isn&apos;t over.
          <span className="gradient-text"> Love can begin again.</span>
        </h1>
        <p className="hero-copy">
          ReKnott is a verified remarriage community for South Indian men and women
          who are divorced or widowed and ready to share life again. Everyone here
          has walked a similar road, so you never have to explain your past to be
          welcomed into someone&apos;s future.
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
          <span className="eyebrow">You are not alone</span>
          <h2 className="section-title">Across South India, others are quietly hoping for the same thing you are.</h2>
          <p className="section-copy">
            Someone who has healed and is ready to trust again. Someone who still believes in a gentle, steady partnership. Two people who meet over coffee and realise neither of them has to pretend. ReKnott is where they meet.
          </p>
        </div>
        <div className="hope-people">
          <HopePerson img="/assets/hope-woman-message.jpg" alt="A young woman in a sky-blue kurta smiling softly at a message on her phone in a Bengaluru café" tag="Ready to trust again">
            The quiet joy of a message from someone who already understands.
          </HopePerson>
          <HopePerson img="/assets/hope-man-balcony.jpg" alt="A young man in a linen kurta on an apartment balcony, smiling as he reads a message" tag="Ready to love again">
            Men heal too. It is okay to hope for a calm, steady partnership.
          </HopePerson>
          <HopePerson img="/assets/hope-first-meeting.jpg" alt="At a first meeting in a Hyderabad cafeteria, a young woman shares her story with moist eyes as a young man listens with empathy" tag="A first meeting">
            A coffee, an honest conversation, and no need to hide your story.
          </HopePerson>
        </div>
        <div className="browse-chips" style={{ justifyContent: "center" }}>{["With children", "Without children", "Widowed", "Divorced", "Working professionals", "NRI journeys", "Family-supported", "At your own pace"].map((item) => <Link className="browse-chip" href="/matches" key={item}>{item}</Link>)}</div></div></section>

    <section className="section section-blush"><div className="container two-column"><div className="photo-panel"><img src="/assets/hope-tender-moment.jpg" alt="On a garden bench, a young man gently offers his open hand as a young woman in a blush saree hesitates, deciding to trust again" loading="lazy" /><div className="photo-panel-copy" style={{ position: "static", borderRadius: 0 }}><strong>Happiness doesn&apos;t replace the past. It grows alongside it.</strong><span>Second marriages built on honesty are often the most deliberate and caring.</span></div></div><div><span className="eyebrow">Why it&apos;s worth hoping again</span><h2 className="section-title">You deserve a home that feels warm again.</h2><p className="section-copy">Remarriage is not starting over from nothing. You bring wisdom, patience and a clear sense of what truly matters. The right partner will value all of it, and build something new with you that is entirely your own.</p><ul className="check-list"><Check title="Companionship">someone to share morning coffee, festivals, hospital visits and quiet evenings with.</Check><Check title="Children">a partner who welcomes your children and is patient while trust grows.</Check><Check title="Family">parents at peace, knowing you are cared for and not alone.</Check><Check title="Yourself">the chance to laugh freely and feel chosen again.</Check></ul><div className="info-box"><strong>Your past needs no apology.</strong> Divorced or widowed, young or in your fifties, there is someone here hoping to meet a person just like you.</div></div></div></section>

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


    <section className="section section-blush"><div className="container"><div className="section-heading"><div><span className="eyebrow">Safety and trust</span><h2 className="section-title">Hope needs trust. So everyone here is verified.</h2></div><p className="section-copy">A profile becomes active only after KYC and the applicable legal-status document have been reviewed. Each badge says what was checked, while sensitive documents remain private.</p></div><div className="feature-grid"><Feature icon="ID" title="KYC for every active member">Identity, age and photograph are checked against an accepted government-issued identity method.</Feature><Feature icon="✓" title="Legal eligibility review">Final court records or an official spouse death certificate are reviewed as applicable. Separation evidence alone does not confirm eligibility to remarry.</Feature><Feature icon="⚑" title="Ongoing reporting and support">Verification reduces impersonation and duplicate accounts, but members can still block, report and request human review.</Feature></div><div className="text-center" style={{ marginTop: 28 }}><Link className="btn btn-secondary" href="/safety">Read the complete verification guide</Link></div></div></section>

    <section className="section"><div className="container"><div className="text-center"><span className="eyebrow">New beginnings</span><h2 className="section-title">Hope sounds like this.</h2><p className="section-copy">The kind of moments our members are looking for. Real stories will be shared here only with both partners&apos; consent; until then, these examples are clearly marked as illustrative.</p></div><div className="quote-grid" style={{ marginTop: 34 }}><Quote source="A family-aware beginning • Hyderabad">We first connected over the things that shaped our everyday lives: family, work and the kind of peaceful home we both wanted.</Quote><Quote source="A thoughtful connection • Chennai">I hoped to meet someone who could understand my journey and still imagine a joyful future with me.</Quote><Quote source="A values-first connection • Bengaluru">We spoke about important subjects early. The honesty gave us more confidence than any perfect profile could.</Quote></div></div></section>

    <CallToAction title="Someone here is hoping to meet a person just like you." text="Create a free, private profile today. Take your time, and say yes only when it feels right." />
  </main>;
}

function TrustProof({ icon, title, text }: { icon: string; title: string; text: string }) { return <div className="trust-proof"><div className="trust-proof-icon">{icon}</div><div><strong>{title}</strong><span>{text}</span></div></div>; }
function Motivation({ tag, featured = false, children }: { tag: string; featured?: boolean; children: React.ReactNode }) { return <article className={`motivation-card${featured ? " featured" : ""}`}><span>{tag}</span><blockquote>{children}</blockquote></article>; }
function PlanPreview({ name, price, detail, recommended = false }: { name: string; price: string; detail: string; recommended?: boolean }) { return <article className={`plan-preview${recommended ? " recommended" : ""}`}>{recommended && <span className="plan-preview-badge">Recommended</span>}<h3>{name}</h3><strong>{price}</strong><p>{detail}</p></article>; }
function Feature({ icon, title, link, linkText, children }: { icon: string; title: string; link?: string; linkText?: string; children: React.ReactNode }) { return <article className="feature-card">{icon && <div className="icon-box">{icon}</div>}<h3>{title}</h3><p>{children}</p>{link && <Link className="text-link" href={link}>{linkText}</Link>}</article>; }
function HopePerson({ img, alt, tag, children }: { img: string; alt: string; tag: string; children: React.ReactNode }) { return <article className="hope-person"><img src={img} alt={alt} loading="lazy" /><div><span>{tag}</span><p>{children}</p></div></article>; }
function Check({ title, children }: { title: string; children: React.ReactNode }) { return <li><span className="check">✓</span><span><strong>{title}:</strong> {children}</span></li>; }
function Quote({ source, children }: { source: string; children: React.ReactNode }) { return <article className="quote-card"><span className="sample-label">Illustrative story</span><div className="quote-mark">“</div><blockquote>{children}</blockquote><div className="quote-source">{source}</div></article>; }
function CallToAction({ title, text }: { title: string; text: string }) { return <section className="section-sm"><div className="container"><div className="cta-panel"><div className="cta-content"><div><h2>{title}</h2><p>{text}</p></div><div className="cta-actions"><Link className="btn btn-light" href="/register">Create my profile</Link><Link className="btn btn-ghost-light" href="/contact">Talk to support</Link></div></div></div></div></section>; }
