"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  apiPost,
  apiPut,
  authRegister,
  authSession,
  getMatches,
  getMyPreferences,
  getMyProfile,
  updateMyProfile,
  updatePreferences,
} from "@/lib/api";
import { profiles, type Profile } from "@/lib/profiles";
import { getProfileGalleryUrls, getProfilePhotoUrl } from "@/lib/profile-photos";

function FormStatus({ message }: { message: string }) {
  return message ? <div className="form-status" role="status">{message}</div> : null;
}

export function QuickSearch() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>);
    window.location.assign(`/matches?${params.toString()}`);
  }

  return (
    <form className="quick-search" onSubmit={submit}>
      <div className="quick-search-title"><span>Start exploring compatible profiles</span><small>Your search stays private</small></div>
      <div className="quick-search-grid">
        <div className="search-field"><label htmlFor="home-gender">Looking for</label><select id="home-gender" name="gender"><option value="woman">Woman</option><option value="man">Man</option></select></div>
        <div className="search-field"><label htmlFor="home-age-from">Age from</label><select id="home-age-from" name="ageFrom" defaultValue="21"><option>21</option><option>25</option><option>30</option><option>35</option><option>40</option></select></div>
        <div className="search-field"><label htmlFor="home-age-to">Age to</label><select id="home-age-to" name="ageTo" defaultValue="40"><option>30</option><option>35</option><option>40</option><option>45</option><option>50</option><option>55</option></select></div>
        <div className="search-field"><label htmlFor="home-city">Living in</label><select id="home-city" name="city"><option value="">Any city</option><option>Hyderabad</option><option>Bengaluru</option><option>Chennai</option><option>Pune</option></select></div>
        <button className="btn btn-primary" type="submit">View matches</button>
      </div>
    </form>
  );
}

export function ProfileCard({ profile }: { profile: Profile }) {
  const [saved, setSaved] = useState(false);
  const photoUrl = profile.photoUrl || getProfilePhotoUrl(profile.id, profile.gender);

  return (
    <article className="profile-card">
      <div
        className="profile-photo"
        style={{
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="profile-badge">✓ {profile.review}</span>
        <button
          className={`favorite-btn${saved ? " active" : ""}`}
          aria-label={saved ? "Remove from favourites" : "Add to favourites"}
          type="button"
          onClick={() => setSaved((value) => !value)}
        >{saved ? "♥" : "♡"}</button>
        <div className="photo-name"><strong>{profile.name}, {profile.age}</strong><span>{profile.role} • {profile.city}</span></div>
      </div>
      <div className="profile-body">
        <div className="profile-meta"><span>{profile.intent === "committed" ? "Ready to build again" : "Exploring companionship"}</span><span>{profile.height}</span><span>{profile.language[0].toUpperCase() + profile.language.slice(1)}</span><span>{profile.value}</span></div>
        <p className="profile-about">{profile.about}</p>
        <div className="profile-tags">{profile.tags.map((tag) => <span className="profile-tag" key={tag}>{tag}</span>)}</div>
        <div className="profile-actions"><Link className="btn btn-secondary btn-sm" href="/register">View profile</Link><Link className="btn btn-primary btn-sm" href="/register">Interest</Link></div>
      </div>
    </article>
  );
}

type MatchFilters = { gender: string; age: string; city: string; intent: string; children: string; language: string };
const emptyFilters: MatchFilters = { gender: "", age: "", city: "", intent: "", children: "", language: "" };

export function MatchesExplorer() {
  const [filters, setFilters] = useState<MatchFilters>(emptyFilters);
  const [applied, setApplied] = useState<MatchFilters>(emptyFilters);
  const [serverMatches, setServerMatches] = useState<Profile[]>([]);
  const [userPreferencesInfo, setUserPreferencesInfo] = useState<string | null>(null);

  // When user is logged in, automatically fetch their partner preferences to filter matching profiles
  useEffect(() => {
    let active = true;
    async function loadUserPreferences() {
      try {
        const sessionRes = await authSession();
        if (!active || !sessionRes.ok || !sessionRes.data?.user) return;

        const [prefRes, profRes] = await Promise.all([
          getMyPreferences().catch(() => ({ ok: false, data: undefined })),
          getMyProfile().catch(() => ({ ok: false, data: undefined })),
        ]);

        if (!active) return;
        const profile = profRes.data || sessionRes.data.profile;
        const prefs = prefRes.data || profile?.preferences;

        const targetGender = profile?.gender === "MAN" ? "woman" : profile?.gender === "WOMAN" ? "man" : "";
        let ageRange = "";
        if (prefs?.ageMin && prefs?.ageMax) {
          if (prefs.ageMax <= 29) ageRange = "21-29";
          else if (prefs.ageMax <= 37) ageRange = "30-37";
          else if (prefs.ageMax <= 44) ageRange = "38-44";
          else ageRange = "45-55";
        }

        const city = prefs?.cities?.[0] || profile?.city || "";
        const language = prefs?.languages?.[0]?.toLowerCase() || "";

        const initialFilters: MatchFilters = {
          gender: targetGender,
          age: ageRange,
          city,
          intent: "committed",
          children: "",
          language,
        };

        setFilters(initialFilters);
        setApplied(initialFilters);
        setUserPreferencesInfo(
          `Preferences loaded for ${sessionRes.data.user.displayName || "Member"} (${targetGender ? (targetGender === "woman" ? "Women" : "Men") : "All"}${city ? `, ${city}` : ""})`,
        );
      } catch { }
    }

    void loadUserPreferences();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchServerMatches() {
      const [min, max] = applied.age ? applied.age.split("-").map(Number) : [undefined, undefined];
      const res = await getMatches({
        gender: applied.gender || undefined,
        city: applied.city || undefined,
        language: applied.language || undefined,
        ageMin: min,
        ageMax: max,
      });

      if (active && res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const currentYear = new Date().getFullYear();
        const mapped: Profile[] = res.data.map((m: any, idx: number) => {
          const gender = m.gender?.toLowerCase() === "woman" ? "woman" : "man";
          const photoUrl = m.photos?.[0]?.url || getProfilePhotoUrl(m.id || m.displayName || idx, gender);
          const galleryUrls = getProfileGalleryUrls(m.id || m.displayName || idx, gender);

          return {
            id: m.id,
            name: m.displayName,
            age: m.dateOfBirth ? currentYear - new Date(m.dateOfBirth).getFullYear() : 34,
            city: m.city || "Hyderabad",
            role: m.profession || "Professional",
            about: m.bio || "Looking forward to meeting someone thoughtful.",
            gender,
            intent: "committed",
            children: m.preferences?.childPreference?.includes("No") ? "none" : "yes",
            language: m.languages?.[0]?.toLowerCase() || "telugu",
            value: m.partnerIntent ? m.partnerIntent.slice(0, 35) + "..." : "Mutual kindness and trust",
            height: m.height || "5' 8\"",
            review: m.verifications?.length ? "KYC & Court Record Verified" : "Verified ReKnott Member",
            photoUrl,
            galleryUrls,
            photoClass: "photo-custom",
            tags: [
              ...(m.languages || ["English"]),
              ...(m.compatibilityScore ? [`${m.compatibilityScore}% Match`] : ["94% Match"]),
            ],
          };
        });
        setServerMatches(mapped);
      } else if (active) {
        setServerMatches([]);
      }
    }
    void fetchServerMatches();
    return () => { active = false; };
  }, [applied]);

  const results = useMemo(() => {
    const localFiltered = profiles.filter((profile) => {
      const [min, max] = applied.age ? applied.age.split("-").map(Number) : [0, 100];
      return (!applied.gender || profile.gender === applied.gender) && (!applied.city || profile.city === applied.city) &&
        (!applied.age || (profile.age >= min && profile.age <= max)) && (!applied.intent || profile.intent === applied.intent) &&
        (!applied.children || profile.children === applied.children) && (!applied.language || profile.language === applied.language);
    });

    if (serverMatches.length > 0) {
      const ids = new Set(serverMatches.map((m) => m.id));
      return [...serverMatches, ...localFiltered.filter((p) => !ids.has(p.id))];
    }
    return localFiltered;
  }, [applied, serverMatches]);

  const set = (field: keyof MatchFilters, value: string) => setFilters((current) => ({ ...current, [field]: value }));
  const reset = () => { setFilters(emptyFilters); setApplied(emptyFilters); setUserPreferencesInfo(null); };

  return (
    <div className="match-layout">
      <form className="filter-sidebar" onSubmit={(event) => { event.preventDefault(); setApplied(filters); }} onReset={reset}>
        <h2>Refine matches</h2>
        {userPreferencesInfo && (
          <div className="preference-active-badge" style={{ margin: "10px 0 14px", padding: "8px 12px", background: "rgba(216, 27, 96, 0.08)", border: "1px solid rgba(216, 27, 96, 0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#8b1548" }}>
            ✓ {userPreferencesInfo}
          </div>
        )}
        <p className="muted-note" style={{ marginTop: 5 }}>Choose only the preferences that genuinely matter.</p>
        <FilterSelect label="Looking for" value={filters.gender} onChange={(v) => set("gender", v)} options={[["", "Everyone"], ["woman", "Woman"], ["man", "Man"]]} />
        <FilterSelect label="Age range" value={filters.age} onChange={(v) => set("age", v)} options={[["", "Any age"], ["21-29", "21-29"], ["30-37", "30-37"], ["38-44", "38-44"], ["45-55", "45-55"]]} />
        <FilterSelect label="Living in" value={filters.city} onChange={(v) => set("city", v)} options={[["", "Any city"], ["Hyderabad", "Hyderabad"], ["Bengaluru", "Bengaluru"], ["Pune", "Pune"], ["Chennai", "Chennai"], ["Mumbai", "Mumbai"]]} />
        <FilterSelect label="Readiness for a new chapter" value={filters.intent} onChange={(v) => set("intent", v)} options={[["", "Any readiness"], ["committed", "Ready to build again"], ["exploring", "Exploring companionship thoughtfully"]]} />
        <FilterSelect label="Children" value={filters.children} onChange={(v) => set("children", v)} options={[["", "Doesn’t matter"], ["none", "No children"], ["yes", "Has children"]]} />
        <FilterSelect label="Mother tongue" value={filters.language} onChange={(v) => set("language", v)} options={[["", "Any language"], ["telugu", "Telugu"], ["hindi", "Hindi"], ["marathi", "Marathi"], ["tamil", "Tamil"], ["kannada", "Kannada"], ["malayalam", "Malayalam"]]} />
        <div className="filter-group"><label>Profile preferences</label><div className="check-options"><label className="check-option"><input type="checkbox" defaultChecked /> With photograph</label><label className="check-option"><input type="checkbox" defaultChecked /> Identity reviewed</label><label className="check-option"><input type="checkbox" /> Open to relocation</label><label className="check-option"><input type="checkbox" /> Community no bar</label></div></div>
        <button className="btn btn-primary btn-block" type="submit">Apply filters</button><button className="btn btn-secondary btn-block" type="reset" style={{ marginTop: 8 }}>Reset</button>
      </form>
      <div>
        <div className="results-toolbar"><div><h2>Matched profiles</h2><span>{results.length} {results.length === 1 ? "profile" : "profiles"} available</span></div><select className="control" aria-label="Sort profiles"><option>Best match</option><option>Recently added</option><option>Age: low to high</option></select></div>
        <div className="profile-grid">{results.map((profile) => <ProfileCard profile={profile} key={profile.id} />)}</div>
        {results.length === 0 && <div className="empty-state is-visible"><h3>No profiles match those specific filters.</h3><p>Try widening one or more preferences. Flexible preferences can improve relevant discovery.</p></div>}
        <p className="muted-note text-center">Verified member profiles and photographs curated for ReKnott.</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  const id = `filter-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div className="filter-group"><label htmlFor={id}>{label}</label><select className="control" id={id} value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, text]) => <option value={optionValue} key={optionValue}>{text}</option>)}</select></div>;
}

export function FaqList({ items }: { items: Array<[string, string]> }) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="faq-list">{items.map(([question, answer], index) => <article className={`faq-item${open === index ? " open" : ""}`} key={question}><button className="faq-question" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}><span>{question}</span><span>+</span></button><div className="faq-answer">{answer}</div></article>)}</div>;
}

export function ConnectedForm({ endpoint, successMessage, reset = false, className = "form-card", children }: { endpoint: string; successMessage: string; reset?: boolean; className?: string; children: ReactNode }) {
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await apiPost(endpoint, body);
      setMessage(result.ok ? (successMessage || result.message) : result.message);
      if (result.ok && reset) form.reset();
    } catch {
      setMessage("We could not complete that request. Please try again.");
    }
  };
  return <form className={className} onSubmit={submit}>{children}<FormStatus message={message} /></form>;
}

export function RegistrationWizard() {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const steps = 5;
  const next = (event: React.MouseEvent<HTMLButtonElement>) => {
    const current = event.currentTarget.closest(".form-step");
    const required = Array.from(current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]") ?? []);
    const invalid = required.find((field) => !field.checkValidity());
    if (invalid) return invalid.reportValidity();
    setStep((value) => Math.min(value + 1, steps - 1));
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const gender = String(values.gender).toUpperCase().replaceAll(" ", "_") as "WOMAN" | "MAN" | "ANOTHER_IDENTITY";
    const validGender = ["WOMAN", "MAN", "ANOTHER_IDENTITY"].includes(gender) ? gender : "MAN";

    setMessage("Creating your private profile draft...");

    const regResult = await authRegister({
      email: String(values.email),
      displayName: String(values.displayName),
      phone: values.phone ? String(values.phone) : undefined,
      gender: validGender,
      city: String(values.city),
      dateOfBirth: String(values.dateOfBirth),
      profession: String(values.profession),
      education: String(values.education),
    });

    if (!regResult.ok) {
      setMessage(regResult.error || "Unable to complete registration. Please check your details.");
      return;
    }

    let ageMin: number | undefined;
    let ageMax: number | undefined;
    if (values.preferredAgeRange) {
      const parts = String(values.preferredAgeRange)
        .split(/[-–—to]+/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (parts.length >= 2) {
        ageMin = Math.min(parts[0], parts[1]);
        ageMax = Math.max(parts[0], parts[1]);
      } else if (parts.length === 1) {
        ageMin = parts[0];
      }
    }

    const prefCities = values.locationPreference
      ? String(values.locationPreference)
        .split(/[,;/]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

    const prefLanguages = values.language ? [String(values.language).trim()] : [];

    await updateMyProfile({
      displayName: String(values.displayName),
      dateOfBirth: String(values.dateOfBirth),
      gender: validGender,
      city: String(values.city),
      email: String(values.email),
      profession: String(values.profession),
      education: String(values.education),
      bio: String(values.bio || ""),
      familyContext: String(values.familyContext || ""),
      partnerIntent: String(values.partnerIntent || ""),
    });

    // Push partner preferences directly into PostgreSQL Preference table
    await updatePreferences({
      ageMin,
      ageMax,
      cities: prefCities,
      languages: prefLanguages,
      childPreference: values.children ? String(values.children) : undefined,
      relocationPreference: values.relocation ? String(values.relocation) : undefined,
      flexibleCriteria: values.preferenceFlexibility ? { flexibility: String(values.preferenceFlexibility) } : undefined,
    });

    setMessage("Profile created successfully! Redirecting to your member dashboard...");
    setTimeout(() => {
      window.location.assign("/member");
    }, 700);
  };

  return (
    <form className="form-card" id="register-form" onSubmit={submit}>
      <div className="progress-wrap"><div className="progress-labels"><span>Step {step + 1} of {steps}</span><span>Private profile draft</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${((step + 1) / steps) * 100}%` }} /></div></div>
      <div className={`form-step${step === 0 ? " active" : ""}`}><h2>Account and basic details</h2><p>Begin with information needed to identify the account owner. ReKnott is a focused community for people seeking companionship after an earlier marriage.</p><div className="field" style={{ marginTop: 22 }}><label>Profile created by</label><div className="radio-cards"><label className="radio-card"><input type="radio" name="createdBy" value="self" defaultChecked required /><span>Myself</span></label><label className="radio-card"><input type="radio" name="createdBy" value="family" required /><span>Family member</span></label></div></div><div className="form-grid"><Field label="Full name" name="displayName" required placeholder="As on identity document" /><SelectField label="Gender" name="gender" required options={["", "Woman", "Man", "Another identity"]} /><Field label="Date of birth" name="dateOfBirth" type="date" required /><Field label="Current city" name="city" required placeholder="Example: Hyderabad" /><Field label="Email" name="email" type="email" required placeholder="you@example.com" /><Field label="Mobile number" name="phone" type="tel" required placeholder="+91 00000 00000" /></div><div className="form-actions"><span /><button className="btn btn-primary" type="button" onClick={next}>Continue →</button></div></div>
      <div className={`form-step${step === 1 ? " active" : ""}`}><h2>Background and eligibility</h2><p>This private information helps the review team identify the correct document path before your profile can become active.</p><div className="form-grid"><SelectField label="Current legal status" name="legalStatus" required options={["", "Legally divorced", "Widowed", "Marriage annulled", "Eligible through another final court order", "Separated", "I need private guidance"]} /><SelectField label="Eligibility document readiness" name="legalEligibility" required options={["", "Final document available", "Requested or awaiting a copy", "I need guidance before activation", "I am not yet legally eligible"]} /><SelectField label="Your readiness today" name="readiness" required options={["", "Ready to build a committed partnership", "Exploring thoughtfully at my own pace", "Prefer to discuss privately"]} /><SelectField label="Religion or belief" name="religion" options={["Prefer not to specify", "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"]} /><SelectField label="Mother tongue" name="language" options={["Telugu", "Hindi", "Tamil", "Kannada", "Marathi", "Malayalam", "Other"]} /><Field label="Highest education" name="education" required placeholder="Degree or qualification" /><Field label="Profession" name="profession" required placeholder="Current occupation" /></div><div className="eligibility-callout compact"><div className="eligibility-icon">!</div><div><strong>What will be requested for activation</strong><p>A final divorce decree or applicable court record, an official spouse death certificate, or another accepted legal document may be required. Separation evidence alone does not confirm eligibility to remarry.</p></div></div><WizardActions step={step} setStep={setStep} next={next} /></div>
      <div className={`form-step${step === 2 ? " active" : ""}`}><h2>Family and present life</h2><p>Share practical context that may shape a future household. Protected details should not be shown publicly.</p><div className="form-grid"><SelectField label="Children" name="children" required options={["", "No children", "Yes, living with me", "Yes, not living with me", "Adult children", "Prefer to discuss privately"]} /><SelectField label="Current household" name="household" options={["Living independently", "Living with parents or family", "Living with children", "Other arrangement"]} /><SelectField label="Open to relocation?" name="relocation" options={["Open to discussion", "Yes, within India", "Yes, including abroad", "No"]} /><SelectField label="Family involvement" name="familyInvolvement" options={["I will manage conversations", "Family may assist after mutual interest", "Family is actively supporting my search"]} /><TextAreaField label="What should a future partner understand about your present life?" name="familyContext" placeholder="Children, caregiving, residence, work travel or other important context, without unnecessary identifying details" /></div><WizardActions step={step} setStep={setStep} next={next} /></div>
      <div className={`form-step${step === 3 ? " active" : ""}`}><h2>Personality and partnership</h2><p>Go beyond biodata and describe the relationship you are ready to build.</p><div className="form-grid"><TextAreaField label="About you today" name="bio" required placeholder="Your personality, interests, routines, values and the parts of life that matter most" /><TextAreaField label="What kind of partnership are you hoping for?" name="partnerIntent" required placeholder="Communication, companionship, family life, independence and shared goals" /><SelectField label="Diet" name="diet" options={["No preference", "Vegetarian", "Non-vegetarian", "Vegan", "Jain"]} /><SelectField label="Smoking preference" name="smokingPreference" options={["No preference", "Non-smoker", "Occasional", "Open to discussion"]} /></div><WizardActions step={step} setStep={setStep} next={next} /></div>
      <div className={`form-step${step === 4 ? " active" : ""}`}><h2>Preferences, privacy and consent</h2><p>Choose an initial discovery setting and the level of support you may want. You can change the plan before payment.</p><div className="form-grid"><Field label="Preferred age range" name="preferredAgeRange" placeholder="Example: 36-45" /><Field label="Location preference" name="locationPreference" placeholder="Cities, states or countries" /><SelectField label="Preference flexibility" name="preferenceFlexibility" full options={["Show close matches even if one preference differs", "Show only profiles meeting all preferences", "Help me decide after completing the profile"]} /><SelectField label="Initial profile visibility" name="visibility" full options={["Private draft, visible only to me", "Visible after review to compatible members", "Visible broadly after review"]} /><SelectField label="Photo visibility" name="photoVisibility" full options={["Protected, approve access individually", "Visible only to accepted interests", "Visible to compatible registered members"]} /><SelectField label="Support preference" name="planPreference" full options={["Explore, free self-service", "Connect, expanded self-service", "Personalised, dedicated Relationship Manager", "Elite, senior RM and background check assistance", "Help me choose later"]} /><label className="field-full checkbox-row"><input name="adultConsent" type="checkbox" required /><span>I confirm that the represented person is an adult, knows about this profile and retains control over profile visibility, outreach and decisions.</span></label><label className="field-full checkbox-row"><input name="verificationConsent" type="checkbox" required /><span>I understand that KYC and legal eligibility review are required before activation, and I agree to receive secure document instructions.</span></label><label className="field-full checkbox-row"><input name="termsConsent" type="checkbox" required /><span>I agree to review the final Terms, Privacy Policy and community rules before the profile becomes active.</span></label></div><div className="form-actions"><button className="btn btn-secondary" type="button" onClick={() => setStep(3)}>Back</button><button className="btn btn-primary" type="submit">Create private draft</button></div></div>
      <FormStatus message={message} />
    </form>
  );
}

function WizardActions({ step, setStep, next }: { step: number; setStep: (value: number) => void; next: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
  return <div className="form-actions"><button className="btn btn-secondary" type="button" onClick={() => setStep(step - 1)}>Back</button><button className="btn btn-primary" type="button" onClick={next}>Continue →</button></div>;
}

function Field({ label, name, type = "text", required = false, placeholder = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return <div className="field"><label htmlFor={name}>{label}</label><input className="control" id={name} name={name} type={type} required={required} placeholder={placeholder} /></div>;
}
function SelectField({ label, name, options, required = false, full = false }: { label: string; name: string; options: string[]; required?: boolean; full?: boolean }) {
  return <div className={`field${full ? " field-full" : ""}`}><label htmlFor={name}>{label}</label><select className="control" id={name} name={name} required={required}>{options.map((option) => <option value={option} key={option || "empty"}>{option || "Select"}</option>)}</select></div>;
}
function TextAreaField({ label, name, required = false, placeholder = "" }: { label: string; name: string; required?: boolean; placeholder?: string }) {
  return <div className="field field-full"><label htmlFor={name}>{label}</label><textarea className="control" id={name} name={name} required={required} placeholder={placeholder} /></div>;
}
