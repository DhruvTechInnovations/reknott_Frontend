"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DemoChat } from "@/components/demo-chat";
import type { DemoPersona } from "@/lib/demo-personas";

type MemberPhoto = { id: number; url: string; cropKey: string; altText: string; sortOrder: number; isPrimary: number; uploaded: boolean };
type MemberProfile = {
  id: string; displayName: string; email: string | null; phone: string | null; age: number; city: string; profession: string;
  bio: string; gender: "woman" | "man" | null; height: string | null; motherTongue: string | null; education: string | null;
  annualIncome: string | null; hometown: string | null; children: string | null; familyDetails: string | null;
  valuesText: string | null; eligibilityLabel: string | null; interests: string[];
};
type MatchProfile = MemberProfile & { photos: MemberPhoto[]; connection: { id: string; status: string } | null; compatibilityScore: number; matchReasons: string[] };
type ViewerProfile = MemberProfile & { preferredGender: "woman" | "man" | null; preferredAgeMin: number | null; preferredAgeMax: number | null; preferredCities: string[] };
type MemberData = { viewer: DemoPersona; viewerProfile: ViewerProfile; ownPhotos: MemberPhoto[]; matches: MatchProfile[] };
type Tab = "matches" | "profile" | "photos";
type ProfileForm = { age: string; city: string; profession: string; bio: string; phone: string; height: string; education: string; children: string; familyDetails: string; valuesText: string; interestsText: string; preferredAgeMin: string; preferredAgeMax: string; preferredCities: string };

export function MemberDashboard() {
  const [data, setData] = useState<MemberData | null>(null);
  const [tab, setTab] = useState<Tab>("matches");
  const [selectedId, setSelectedId] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadMember() {
    try {
      const response = await fetch("/api/demo/member", { cache: "no-store" });
      if (response.status === 401) { setData(null); return; }
      const payload = await response.json() as MemberData & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load your member account.");
      setData(payload);
      setSelectedId((current) => payload.matches.some((match) => match.id === current) ? current : (payload.matches[0]?.id ?? ""));
      setForm(profileToForm(payload.viewerProfile));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load your member account.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMember(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const selected = useMemo(() => data?.matches.find((match) => match.id === selectedId) ?? data?.matches[0] ?? null, [data, selectedId]);

  async function signOut() {
    await fetch("/api/demo/logout", { method: "POST" });
    window.location.assign("/login");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/demo/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, age: Number(form.age), preferredAgeMin: Number(form.preferredAgeMin), preferredAgeMax: Number(form.preferredAgeMax) }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to save your profile.");
      await loadMember();
      setNotice("Your profile and match preferences are updated.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save your profile."); }
    finally { setBusy(false); }
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("photo") as HTMLInputElement;
    if (!input.files?.[0]) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const body = new FormData(); body.append("photo", input.files[0]);
      const response = await fetch("/api/demo/photos", { method: "POST", body });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to upload the photograph.");
      input.value = "";
      await loadMember();
      setNotice("Your photograph has been added.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to upload the photograph."); }
    finally { setBusy(false); }
  }

  async function deletePhoto(photo: MemberPhoto) {
    if (!photo.uploaded || !window.confirm("Remove this photograph from your profile?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/demo/photos/${photo.id}`, { method: "DELETE" });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to remove the photograph.");
      await loadMember(); setNotice("The photograph has been removed.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to remove the photograph."); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="chat-state"><span className="chat-loader" />Preparing your member account...</div>;
  if (!data) return <div className="chat-state"><h2>Member sign-in required</h2><p>Enter your username or email and password to continue.</p><Link className="btn btn-primary" href="/login">Go to member login</Link></div>;

  const targetLabel = data.viewerProfile.preferredGender === "woman" ? "women" : "men";
  return (
    <div className="member-dashboard">
      <header className="member-dashboard-head">
        <div className="member-signed-in"><span className="member-kicker">Your ReKnott account</span><div><div className="demo-avatar compact" aria-hidden="true">{data.viewer.initials}</div><div><h1>Welcome, {data.viewer.displayName.split(" ")[0]}</h1><p>{data.viewerProfile.profession} · {data.viewerProfile.city}</p></div></div></div>
        <div className="member-head-actions"><span className="verified-pill">✓ KYC verified</span><button type="button" onClick={signOut}>Sign out</button></div>
      </header>

      <nav className="member-tabs" aria-label="Member account">
        <button className={tab === "matches" ? "active" : ""} onClick={() => setTab("matches")} type="button"><span aria-hidden="true">♥</span> Matches</button>
        <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")} type="button"><span aria-hidden="true">♙</span> My profile</button>
        <button className={tab === "photos" ? "active" : ""} onClick={() => setTab("photos")} type="button"><span aria-hidden="true">▧</span> Photos</button>
      </nav>
      {error && <p className="demo-error member-alert" role="alert">{error}</p>}
      {notice && <p className="member-notice" role="status">✓ {notice}</p>}

      {tab === "matches" && (
        <section className="member-match-browser">
          <div className="member-browser-head"><div><span className="member-kicker">Ranked for you</span><h2>{targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} who match your preferences</h2><p>Ranking considers your preferred age range, cities, language and shared interests.</p></div><button className="text-link" type="button" onClick={() => setTab("profile")}>Adjust preferences</button></div>
          <div className="member-match-rail" aria-label="Ranked member matches">
            {data.matches.map((match) => <button className={`member-match-tile${selected?.id === match.id ? " active" : ""}`} type="button" key={match.id} onClick={() => { setSelectedId(match.id); setPhotoIndex(0); }}><Photo photo={match.photos[0]} /><span className="match-score">{match.compatibilityScore}% match</span><strong>{match.displayName}, {match.age}</strong><small>{match.profession}<br />{match.city}</small></button>)}
          </div>
          {selected ? <MatchDetail match={selected} photoIndex={photoIndex} setPhotoIndex={setPhotoIndex} /> : <div className="chat-state"><h2>No matches yet</h2><p>Update your preferences and return as new verified members join.</p></div>}
        </section>
      )}

      {tab === "profile" && form && (
        <section className="member-management-card"><div className="management-heading"><span className="member-kicker">Profile management</span><h2>Keep your story and requirements current</h2><p>These details improve match ranking and help suitable members understand what matters to you.</p></div>
          <form className="member-profile-form" onSubmit={saveProfile}>
            <Field label="Age"><input className="control" type="number" min="21" max="80" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} required /></Field>
            <Field label="Current city"><input className="control" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required /></Field>
            <Field label="Profession"><input className="control" value={form.profession} onChange={(event) => setForm({ ...form, profession: event.target.value })} required /></Field>
            <Field label="Phone number"><input className="control" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Height"><input className="control" value={form.height} onChange={(event) => setForm({ ...form, height: event.target.value })} /></Field>
            <Field label="Education"><input className="control" value={form.education} onChange={(event) => setForm({ ...form, education: event.target.value })} /></Field>
            <Field label="Children"><input className="control" value={form.children} onChange={(event) => setForm({ ...form, children: event.target.value })} /></Field>
            <Field label="Profile introduction" wide><textarea className="control" rows={4} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} required /></Field>
            <Field label="Family details" wide><textarea className="control" rows={3} value={form.familyDetails} onChange={(event) => setForm({ ...form, familyDetails: event.target.value })} /></Field>
            <Field label="Values" wide><textarea className="control" rows={3} value={form.valuesText} onChange={(event) => setForm({ ...form, valuesText: event.target.value })} /></Field>
            <Field label="Interests, separated by commas" wide><input className="control" value={form.interestsText} onChange={(event) => setForm({ ...form, interestsText: event.target.value })} /></Field>
            <div className="preference-form-title"><span aria-hidden="true">♥</span><div><strong>My match requirements</strong><small>Only {targetLabel} are shown in this account.</small></div></div>
            <Field label="Preferred age from"><input className="control" type="number" min="21" max="80" value={form.preferredAgeMin} onChange={(event) => setForm({ ...form, preferredAgeMin: event.target.value })} required /></Field>
            <Field label="Preferred age to"><input className="control" type="number" min="21" max="80" value={form.preferredAgeMax} onChange={(event) => setForm({ ...form, preferredAgeMax: event.target.value })} required /></Field>
            <Field label="Preferred cities, separated by commas" wide><input className="control" value={form.preferredCities} onChange={(event) => setForm({ ...form, preferredCities: event.target.value })} /></Field>
            <div className="profile-save-row"><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save profile and preferences"}</button></div>
          </form>
        </section>
      )}

      {tab === "photos" && (
        <section className="member-management-card"><div className="management-heading"><span className="member-kicker">Photo management</span><h2>Share recent photographs that feel like you</h2><p>Add up to five personal JPEG, PNG or WebP photographs. Each file can be up to 5 MB.</p></div>
          <form className="photo-upload-form" onSubmit={uploadPhoto}><input className="control" type="file" name="photo" accept="image/jpeg,image/png,image/webp" required /><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Uploading..." : "Upload photograph"}</button></form>
          <div className="own-photo-grid">{data.ownPhotos.map((photo) => <article key={photo.id}><Photo photo={photo} /><div><span>{photo.uploaded ? "Your upload" : "Primary profile photograph"}</span>{photo.uploaded && <button type="button" onClick={() => void deletePhoto(photo)} disabled={busy}>Remove</button>}</div></article>)}</div>
        </section>
      )}
    </div>
  );
}

function MatchDetail({ match, photoIndex, setPhotoIndex }: { match: MatchProfile; photoIndex: number; setPhotoIndex: (index: number) => void }) {
  const currentPhoto = match.photos[photoIndex] ?? match.photos[0];
  const connected = match.connection?.status === "connected";
  return <div className="member-workspace member-ranked-detail">
    <section className="member-profile-card" aria-label={`${match.displayName} profile`}>
      <div className="member-match-heading"><div><span className="member-kicker">{match.compatibilityScore}% compatibility</span><h2>{match.displayName}, {match.age}</h2><p>{match.profession} · {match.city}</p></div>{connected ? <span className="connection-pill"><i /> Connected</span> : <span className="reviewed-pill">✓ Verified member</span>}</div>
      <div className="member-gallery"><Photo photo={currentPhoto} large />{match.photos.length > 1 && <><button className="gallery-arrow previous" type="button" aria-label="Previous photograph" onClick={() => setPhotoIndex((photoIndex - 1 + match.photos.length) % match.photos.length)}>‹</button><button className="gallery-arrow next" type="button" aria-label="Next photograph" onClick={() => setPhotoIndex((photoIndex + 1) % match.photos.length)}>›</button></>}<div className="gallery-count">Photo {match.photos.length ? photoIndex + 1 : 0} of {match.photos.length}</div></div>
      <div className="match-reasons">{match.matchReasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div>
      <div className="member-profile-section"><h3>About {match.displayName.split(" ")[0]}</h3><p>{match.bio}</p></div>
      <div className="biodata-section"><div className="profile-section-title"><div><span aria-hidden="true">🦋</span><h3>Biodata</h3></div><small>Verified member information</small></div><dl className="biodata-grid"><Biodata label="Age" value={`${match.age} years`} /><Biodata label="Height" value={match.height} /><Biodata label="Mother tongue" value={match.motherTongue} /><Biodata label="Education" value={match.education} /><Biodata label="Profession" value={match.profession} /><Biodata label="Income" value={match.annualIncome} /><Biodata label="Current city" value={match.city} /><Biodata label="Hometown" value={match.hometown} /><Biodata label="Children" value={match.children} wide /><Biodata label="Readiness" value={match.eligibilityLabel} wide /></dl></div>
      <div className="member-profile-section"><h3>Family and values</h3><p>{match.familyDetails}</p><p>{match.valuesText}</p></div>
      <div className="member-profile-section"><h3>Interests</h3><div className="member-interest-list">{match.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></div>
      {connected ? <div className="contact-reveal"><div className="contact-reveal-icon" aria-hidden="true">♥</div><div><span>Contact shared after mutual connection</span><strong>{match.phone}</strong><small>{match.email}</small></div></div> : <div className="contact-reveal private-contact"><div className="contact-reveal-icon" aria-hidden="true">♥</div><div><span>Private until you connect</span><strong>Phone number and messaging are protected</strong><small>Contact details become available after mutual connection.</small></div></div>}
    </section>
    <aside className="member-chat-column">{connected ? <><div className="member-chat-intro"><span className="member-kicker">Private conversation</span><h2>Talk to {match.displayName.split(" ")[0]}</h2><p>Your messages and read receipts stay inside your member account.</p></div><DemoChat embedded /></> : <div className="connection-prompt"><span aria-hidden="true">♥</span><h2>Interested in connecting?</h2><p>Mutual connection enables private messages, phone number and email access. Interest requests are guided by the ReKnott member team in this demonstration.</p><button className="btn btn-primary" type="button">Express interest</button></div>}</aside>
  </div>;
}

function Photo({ photo, large = false }: { photo?: MemberPhoto; large?: boolean }) {
  if (!photo) return <div className={large ? "member-gallery-empty" : "member-tile-photo empty"}>No photo</div>;
  return <div className={`${large ? "member-gallery-photo" : "member-tile-photo"} crop-${photo.cropKey}`} style={{ backgroundImage: `url(${photo.url})` }} role="img" aria-label={photo.altText} />;
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`field${wide ? " field-wide" : ""}`}><span>{label}</span>{children}</label>; }
function Biodata({ label, value, wide = false }: { label: string; value: string | null; wide?: boolean }) { return <div className={wide ? "wide" : ""}><dt>{label}</dt><dd>{value ?? "Not specified"}</dd></div>; }
function profileToForm(profile: ViewerProfile): ProfileForm { return { age: String(profile.age), city: profile.city, profession: profile.profession, bio: profile.bio, phone: profile.phone ?? "", height: profile.height ?? "", education: profile.education ?? "", children: profile.children ?? "", familyDetails: profile.familyDetails ?? "", valuesText: profile.valuesText ?? "", interestsText: profile.interests.join(", "), preferredAgeMin: String(profile.preferredAgeMin ?? 30), preferredAgeMax: String(profile.preferredAgeMax ?? 50), preferredCities: profile.preferredCities.join(", ") }; }
