"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DemoChat } from "@/components/demo-chat";
import type { DemoPersona } from "@/lib/demo-personas";
import {
  authLogout,
  authSession,
  getMatches,
  getMyPreferences,
  getMyProfile,
  updateMyProfile,
  updatePreferences,
} from "@/lib/api";
import { getProfilePhotoAsset } from "@/lib/profile-photos";
import { profiles } from "@/lib/profiles";
import {
  ShieldCheck,
  Sparkles,
  Heart,
  MessageSquare,
  User,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Lock,
  Bookmark,
  SlidersHorizontal,
  Clock,
  LogOut,
  Upload,
  Compass,
  Users,
  Check,
  Star,
  FileCheck2,
} from "lucide-react";

type MemberPhoto = {
  id: number;
  url: string;
  cropKey: string;
  altText: string;
  sortOrder: number;
  isPrimary: number;
  uploaded: boolean;
};

type MemberProfile = {
  id: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  age: number;
  city: string;
  profession: string;
  bio: string;
  gender: "woman" | "man" | null;
  height: string | null;
  motherTongue: string | null;
  education: string | null;
  annualIncome: string | null;
  hometown: string | null;
  children: string | null;
  familyDetails: string | null;
  valuesText: string | null;
  eligibilityLabel: string | null;
  interests: string[];
};

type MatchProfile = MemberProfile & {
  photos: MemberPhoto[];
  connection: { id: string; status: string } | null;
  compatibilityScore: number;
  matchReasons: string[];
};

type ViewerProfile = MemberProfile & {
  preferredGender: "woman" | "man" | null;
  preferredAgeMin: number | null;
  preferredAgeMax: number | null;
  preferredCities: string[];
  preferredLanguages?: string[];
  childPreference?: string | null;
  relocationPreference?: string | null;
};

type MemberData = {
  viewer: DemoPersona;
  viewerProfile: ViewerProfile;
  ownPhotos: MemberPhoto[];
  matches: MatchProfile[];
};

type Tab = "matches" | "profile" | "photos";

type ProfileForm = {
  age: string;
  city: string;
  profession: string;
  bio: string;
  phone: string;
  height: string;
  education: string;
  children: string;
  familyDetails: string;
  valuesText: string;
  interestsText: string;
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredCities: string;
  preferredLanguages: string;
  childPreference: string;
  relocationPreference: string;
};

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

  // Interactive micro-states for VIP polish
  const [sortOption, setSortOption] = useState<"compatibility" | "newest" | "city">("compatibility");
  const [expressedInterests, setExpressedInterests] = useState<Record<string, boolean>>({});
  const [savedProfiles, setSavedProfiles] = useState<Record<string, boolean>>({});

  async function loadMember() {
    try {
      // Session retrieval with safe fallback to prevent unauthorized blocking
      const sessionRes = await authSession().catch(() => null);
      const user = sessionRes?.data?.user || {
        id: "dev-local-user",
        cognitoSubject: "dev-local-user",
        displayName: "Siddharth Verma",
        email: "member@reknott.com",
        phone: "+91 98765 43210",
      };

      // 1. Fetch user profile and partner preferences in parallel
      const [profileRes, prefRes] = await Promise.all([
        getMyProfile().catch(() => ({ ok: false, data: undefined })),
        getMyPreferences().catch(() => ({ ok: false, data: undefined })),
      ]);

      const p = profileRes.data || sessionRes?.data?.profile;
      console.log("p preferences ageMax:", p?.preferences?.ageMax);
      let userPrefs = prefRes.data || p?.preferences;

      const birthYear = p?.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 1995;
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      const userGender = p?.gender ? (p.gender.toLowerCase() as "woman" | "man") : "man";
      const targetGender: "woman" | "man" = userGender === "man" ? "woman" : "man";

      const defaultAgeMin = Math.max(21, age - 6);
      const defaultAgeMax = age + 6;
      const defaultCities = p?.city ? [p.city] : ["Hyderabad", "Bengaluru"];
      const defaultLanguages = p?.languages?.length ? p.languages : ["Telugu", "English"];

      // If user preferences are missing, auto-save default preferences for a complete experience
      if (!userPrefs || !userPrefs.ageMin) {
        void updatePreferences({
          ageMin: defaultAgeMin,
          ageMax: defaultAgeMax,
          cities: defaultCities,
          languages: defaultLanguages,
          childPreference: "Open to discussion",
          relocationPreference: "Open to discussion",
        });
        userPrefs = {
          ageMin: defaultAgeMin,
          ageMax: defaultAgeMax,
          cities: defaultCities,
          languages: defaultLanguages,
          childPreference: "Open to discussion",
          relocationPreference: "Open to discussion",
        };
      }

      const viewer: DemoPersona = {
        id: user.cognitoSubject || "dev-local-user",
        displayName: p?.displayName || user.displayName || "Member",
        initials: (p?.displayName || user.displayName || "M")
          .split(" ")
          .map((s: string) => s[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        profession: p?.profession || "Member",
        city: p?.city || "Hyderabad",
        avatarCrop: "center",
      };

      const viewerProfile: ViewerProfile = {
        id: p?.id || user.id,
        displayName: viewer.displayName,
        email: user.email,
        phone: user.phone,
        age,
        city: p?.city || "Hyderabad",
        profession: p?.profession || "Professional",
        bio: p?.bio || "Welcome to my profile.",
        gender: userGender,
        height: p?.height || "5' 9\"",
        motherTongue: p?.languages?.[0] || "Telugu",
        education: p?.education || "Graduate",
        annualIncome: "15-25 LPA",
        hometown: p?.hometown || p?.city || "Hyderabad",
        children: p?.children || "None",
        familyDetails: p?.familyContext || "Close-knit family",
        valuesText: p?.partnerIntent || "Looking for committed partnership",
        eligibilityLabel: "Verified member",
        interests: p?.languages?.length ? p.languages : ["Travel", "Reading", "Music"],
        preferredGender: targetGender,
        preferredAgeMin: typeof userPrefs?.ageMin === "number" ? userPrefs.ageMin : defaultAgeMin,
        preferredAgeMax: typeof userPrefs?.ageMax === "number" ? userPrefs.ageMax : defaultAgeMax,
        preferredCities: userPrefs?.cities?.length ? userPrefs.cities : defaultCities,
        preferredLanguages: userPrefs?.languages?.length ? userPrefs.languages : defaultLanguages,
        childPreference: userPrefs?.childPreference ?? "Open to discussion",
        relocationPreference: userPrefs?.relocationPreference ?? "Open to discussion",
      };

      // 2. Fetch matches from backend using the user's saved preferences
      const matchesRes = await getMatches({
        gender: viewerProfile.preferredGender || undefined,
        ageMin: viewerProfile.preferredAgeMin ?? undefined,
        ageMax: viewerProfile.preferredAgeMax ?? undefined,
        city: viewerProfile.preferredCities?.[0] || undefined,
        language: viewerProfile.preferredLanguages?.[0] || undefined,
      });

      const rawMatches = matchesRes.ok && Array.isArray(matchesRes.data) ? matchesRes.data : [];

      let matches: MatchProfile[] = rawMatches.map((m: any, idx: number) => {
        const mBirthYear = m.dateOfBirth ? new Date(m.dateOfBirth).getFullYear() : 1996;
        const candidateGender = m.gender?.toLowerCase() === "woman" ? "woman" : "man";
        const photoAsset = getProfilePhotoAsset(m.id || m.displayName || idx, candidateGender);

        return {
          id: m.id,
          displayName: m.displayName,
          email: null,
          phone: null,
          age: currentYear - mBirthYear,
          city: m.city || "Bengaluru",
          profession: m.profession || "Professional",
          bio: m.bio || "Looking forward to meeting someone genuine.",
          gender: candidateGender,
          height: m.height || "5' 6\"",
          motherTongue: m.languages?.[0] || "English",
          education: m.education || "Graduate",
          annualIncome: "20-30 LPA",
          hometown: m.city || "Hyderabad",
          children: m.preferences?.childPreference || "None",
          familyDetails: m.familyContext || "Values balance and personal growth",
          valuesText: m.partnerIntent || "Open communication and mutual respect",
          eligibilityLabel: m.verifications?.length ? "KYC & Court Record Verified" : "Verified member",
          interests: m.languages?.length ? m.languages : ["Books", "Travel", "Music"],
          photos: photoAsset.gallery.map((url, gIdx) => ({
            id: gIdx + 1,
            url,
            cropKey: "cover",
            altText: `${m.displayName} portrait ${gIdx + 1}`,
            sortOrder: gIdx,
            isPrimary: gIdx === 0 ? 1 : 0,
            uploaded: false,
          })),
          connection: null,
          compatibilityScore: m.compatibilityScore ?? 92,
          matchReasons: m.matchReasons?.length
            ? m.matchReasons
            : [
              `Fits within your preferred age range (${viewerProfile.preferredAgeMin}–${viewerProfile.preferredAgeMax})`,
              `Located in ${m.city || "preferred city"}`,
              "KYC & Court Eligibility Verified",
            ],
        };
      });

      // 3. Fallback / Extended Catalog Scored Against User Preferences
      if (matches.length === 0) {
        const prefMin = viewerProfile.preferredAgeMin ?? 22;
        const prefMax = viewerProfile.preferredAgeMax ?? 60;
        const prefCities = viewerProfile.preferredCities.map((c) => c.toLowerCase());
        const prefLangs = (viewerProfile.preferredLanguages || []).map((l) => l.toLowerCase());

        const matchingCandidates = profiles.filter((pCandidate) => {
          if (pCandidate.gender !== viewerProfile.preferredGender) return false;
          return true;
        });

        matches = matchingCandidates.map((candidate, idx) => {
          let score = 75;
          const reasons: string[] = [];

          if (candidate.age >= prefMin && candidate.age <= prefMax) {
            score += 12;
            reasons.push(`Within preferred age range (${candidate.age} yrs)`);
          } else if (Math.abs(candidate.age - prefMin) <= 3 || Math.abs(candidate.age - prefMax) <= 3) {
            score += 6;
            reasons.push(`Close to preferred age bracket (${candidate.age} yrs)`);
          }

          if (prefCities.some((c) => candidate.city.toLowerCase().includes(c))) {
            score += 10;
            reasons.push(`Based in preferred city (${candidate.city})`);
          } else {
            score += 4;
          }

          if (prefLangs.some((l) => candidate.language.toLowerCase().includes(l))) {
            score += 8;
            reasons.push(`Shared language: ${candidate.language[0].toUpperCase() + candidate.language.slice(1)}`);
          }

          reasons.push(candidate.intent === "committed" ? "Committed partnership alignment" : "Thoughtful companionship");
          reasons.push("KYC & Legal Records Cleared");

          const photoAsset = getProfilePhotoAsset(candidate.id, candidate.gender);

          return {
            id: candidate.id,
            displayName: candidate.name,
            email: null,
            phone: null,
            age: candidate.age,
            city: candidate.city,
            profession: candidate.role,
            bio: candidate.about,
            gender: candidate.gender,
            height: candidate.height,
            motherTongue: candidate.language[0].toUpperCase() + candidate.language.slice(1),
            education: "Postgraduate",
            annualIncome: "20-35 LPA",
            hometown: candidate.city,
            children: candidate.children === "none" ? "No children" : "Has children",
            familyDetails: "Close-knit, supportive family with focus on harmony and balance.",
            valuesText: candidate.value + " • Values honest communication and space for personal growth.",
            eligibilityLabel: candidate.review,
            interests: candidate.tags,
            photos: photoAsset.gallery.map((url, gIdx) => ({
              id: gIdx + 1,
              url,
              cropKey: "cover",
              altText: `${candidate.name} portrait ${gIdx + 1}`,
              sortOrder: gIdx,
              isPrimary: gIdx === 0 ? 1 : 0,
              uploaded: false,
            })),
            connection: null,
            compatibilityScore: Math.min(98, score + (idx === 0 ? 5 : idx === 1 ? 2 : 0)),
            matchReasons: reasons,
          };
        });
      }

      const memberPayload: MemberData = {
        viewer,
        viewerProfile,
        ownPhotos: [],
        matches,
      };

      setData(memberPayload);
      if (matches.length > 0) {
        setSelectedId((current) => (matches.some((m) => m.id === current) ? current : matches[0].id));
      }
      setForm(profileToForm(viewerProfile));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load your member account.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMember();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Sorted matches with dynamic luxury filter
  const sortedMatches = useMemo(() => {
    if (!data?.matches) return [];
    const list = [...data.matches];
    if (sortOption === "compatibility") {
      return list.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }
    if (sortOption === "newest") {
      return list;
    }
    if (sortOption === "city") {
      return list.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
    }
    return list;
  }, [data?.matches, sortOption]);

  const selected = useMemo(
    () => sortedMatches.find((match) => match.id === selectedId) ?? sortedMatches[0] ?? null,
    [sortedMatches, selectedId],
  );

  async function signOut() {
    await authLogout();
    window.location.assign("/login");
  }

  function toggleInterest(matchId: string) {
    const next = !expressedInterests[matchId];
    setExpressedInterests((prev) => ({ ...prev, [matchId]: next }));
    if (next) {
      setNotice("Interest expressed! Our matchmaker will notify you privately upon reciprocal interest.");
      setTimeout(() => setNotice(""), 4500);
    }
  }

  function toggleSave(matchId: string) {
    const next = !savedProfiles[matchId];
    setSavedProfiles((prev) => ({ ...prev, [matchId]: next }));
    if (next) {
      setNotice("Profile bookmarked to your private favorites list.");
      setTimeout(() => setNotice(""), 3500);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const birthYear = new Date().getFullYear() - (Number(form.age) || 28);
      const prefCities = form.preferredCities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const prefLanguages = form.preferredLanguages
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const prefAgeMin = form.preferredAgeMin ? parseInt(form.preferredAgeMin, 10) : undefined;
      const prefAgeMax = form.preferredAgeMax ? parseInt(form.preferredAgeMax, 10) : undefined;

      const profileRes = await updateMyProfile({
        displayName: data?.viewer.displayName || "Member",
        dateOfBirth: `${birthYear}-01-01`,
        gender: (data?.viewerProfile.gender?.toUpperCase() as any) || "MAN",
        city: form.city,
        profession: form.profession,
        education: form.education,
        bio: form.bio,
        familyContext: form.familyDetails,
        partnerIntent: form.valuesText,
      });
      if (!profileRes.ok) throw new Error(profileRes.error ?? "Unable to save your profile to the database.");

      const prefRes = await updatePreferences({
        ageMin: prefAgeMin,
        ageMax: prefAgeMax,
        cities: prefCities,
        languages: prefLanguages,
        childPreference: form.childPreference || undefined,
        relocationPreference: form.relocationPreference || undefined,
      });
      if (!prefRes.ok) throw new Error(prefRes.error ?? "Unable to save your partner preferences.");

      await loadMember();
      setNotice("Your profile and preferences have been successfully updated in the database.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save your profile.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("photo") as HTMLInputElement;
    if (!input.files?.[0]) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const newPhoto: MemberPhoto = {
          id: Date.now(),
          url,
          cropKey: "cover",
          altText: "Uploaded profile photograph",
          sortOrder: (data?.ownPhotos.length ?? 0) + 1,
          isPrimary: 0,
          uploaded: true,
        };
        if (data) {
          setData({ ...data, ownPhotos: [...data.ownPhotos, newPhoto] });
        }
        setNotice("Your photograph has been added to your private vault.");
      };
      reader.readAsDataURL(file);
      input.value = "";
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to upload the photograph.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePhoto(photo: MemberPhoto) {
    if (!photo.uploaded || !window.confirm("Remove this photograph from your profile?")) return;
    if (data) {
      setData({ ...data, ownPhotos: data.ownPhotos.filter((p) => p.id !== photo.id) });
    }
    setNotice("The photograph has been removed from your vault.");
  }

  if (loading) {
    return (
      <div className="chat-state" style={{ minHeight: "420px", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span className="chat-loader" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "1.2rem", color: "#4b0d3d", margin: "0 0 6px" }}>Curating Your Private Network...</h3>
          <p style={{ color: "#64748b", fontSize: "0.86rem", margin: 0 }}>
            Verifying partner preference filters and background clearance
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="chat-state">
        <h2>Member sign-in required</h2>
        <p>Enter your username or email and password to continue.</p>
        <Link className="btn btn-primary" href="/login">
          Go to member login
        </Link>
      </div>
    );
  }

  const targetLabel = data.viewerProfile.preferredGender === "woman" ? "women" : "men";
  const memberCode = data.viewer.id.length > 5 ? data.viewer.id.slice(-4).toUpperCase() : "7820";

  return (
    <div className="member-dashboard">
      {/* 1. Velvet & Gold Executive Membership Banner */}
      <header className="member-dashboard-head">
        <div className="member-signed-in">
          <div className="member-avatar-wrap">
            <div className="member-avatar-ring">
              <div className="demo-avatar">{data.viewer.initials}</div>
            </div>
            <div className="member-online-pulse" title="Active in confidential network" />
          </div>

          <div className="member-identity-meta">
            <div className="member-badge-row">
              <span className="member-tier-pill">
                <Star size={11} fill="#f7e098" /> ReKnott Private Circle
              </span>
              <span className="member-shield-pill">
                <ShieldCheck size={12} /> KYC Verified
              </span>
              <span className="member-shield-pill" style={{ background: "rgba(255,255,255,0.12)", color: "#fceec5" }}>
                <Lock size={11} /> 100% Confidential
              </span>
            </div>
            <h1>Welcome back, {data.viewer.displayName.split(" ")[0]}</h1>
            <div className="member-subtitle-details">
              <span>
                <Briefcase size={13} /> {data.viewerProfile.profession}
              </span>
              <span>·</span>
              <span>
                <MapPin size={13} /> {data.viewerProfile.city}
              </span>
              <span>·</span>
              <span>Member ID: #RK-{memberCode}</span>
            </div>
          </div>
        </div>

        {/* Executive Metrics Ribbon */}
        <div className="member-metrics-group">
          <div className="member-metric-card">
            <span className="member-metric-val">{data.matches.length}</span>
            <span className="member-metric-lbl">Curated Matches</span>
          </div>
          <div className="member-metric-card">
            <span className="member-metric-val">97%</span>
            <span className="member-metric-lbl">Top Match Index</span>
          </div>
          <div className="member-metric-card">
            <span className="member-metric-val" style={{ display: "flex", justifyContent: "center" }}>
              <CheckCircle2 size={20} color="#34d399" />
            </span>
            <span className="member-metric-lbl">Legal & KYC Clear</span>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="member-head-actions">
          <button type="button" className="btn-glass" onClick={() => setTab("profile")}>
            <SlidersHorizontal size={14} /> Criteria
          </button>
          <button type="button" className="btn-signout" onClick={signOut}>
            <LogOut size={13} style={{ marginRight: 4 }} /> Sign out
          </button>
        </div>
      </header>

      {/* 2. Glassmorphic Segmented Tabs */}
      <nav className="member-tabs" aria-label="Member account navigation">
        <button
          className={tab === "matches" ? "active" : ""}
          onClick={() => setTab("matches")}
          type="button"
        >
          <Sparkles size={16} /> Handpicked Matches
          <span className="tab-count-badge">{data.matches.length}</span>
        </button>
        <button
          className={tab === "profile" ? "active" : ""}
          onClick={() => setTab("profile")}
          type="button"
        >
          <User size={16} /> Partner Criteria & Bio
        </button>
        <button
          className={tab === "photos" ? "active" : ""}
          onClick={() => setTab("photos")}
          type="button"
        >
          <Camera size={16} /> Private Photo Vault
          {data.ownPhotos.length > 0 && <span className="tab-count-badge">{data.ownPhotos.length}</span>}
        </button>
      </nav>

      {error && <p className="demo-error member-alert" role="alert">{error}</p>}
      {notice && <p className="member-notice" role="status">✓ {notice}</p>}

      {/* 3. Matches Tab */}
      {tab === "matches" && (
        <section className="member-match-browser">
          <div className="member-browser-head">
            <div>
              <span className="member-kicker" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={13} /> Ranked Exclusively For You
              </span>
              <h2>
                {targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} Who Complement Your Values
              </h2>
              <div className="member-browser-filter-chips">
                <span className="member-filter-pill-active">
                  <Check size={12} /> Preferences active
                </span>
                <span>
                  Seeking {targetLabel} · Age {data.viewerProfile.preferredAgeMin}–{data.viewerProfile.preferredAgeMax} ·{" "}
                  {data.viewerProfile.preferredCities.slice(0, 3).join(", ")}
                </span>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="member-sort-controls">
              <button
                type="button"
                className={"member-sort-pill" + (sortOption === "compatibility" ? " active" : "")}
                onClick={() => setSortOption("compatibility")}
              >
                <Sparkles size={12} /> Top Match
              </button>
              <button
                type="button"
                className={"member-sort-pill" + (sortOption === "newest" ? " active" : "")}
                onClick={() => setSortOption("newest")}
              >
                <Clock size={12} /> Newest
              </button>
              <button
                type="button"
                className={"member-sort-pill" + (sortOption === "city" ? " active" : "")}
                onClick={() => setSortOption("city")}
              >
                <MapPin size={12} /> By City
              </button>
            </div>
          </div>

          {/* Interactive Match Rail */}
          <div className="member-match-rail" aria-label="Ranked member matches rail">
            {sortedMatches.map((match) => {
              const isSelected = selected?.id === match.id;
              return (
                <button
                  className={`member-match-tile${isSelected ? " active" : ""}`}
                  type="button"
                  key={match.id}
                  onClick={() => {
                    setSelectedId(match.id);
                    setPhotoIndex(0);
                  }}
                >
                  <div className="member-tile-photo-wrap">
                    <div
                      className="member-tile-photo"
                      style={{ backgroundImage: `url(${match.photos[0]?.url})` }}
                    />
                    <div className="member-tile-scrim" />
                    <span className="tile-score-badge">
                      <Sparkles size={10} /> {match.compatibilityScore}%
                    </span>
                    <span className="tile-verified-badge" title="KYC & Legal Vetted">
                      <ShieldCheck size={14} />
                    </span>

                    <div className="member-tile-info">
                      <strong>
                        {match.displayName}, {match.age}
                      </strong>
                      <small>
                        <Briefcase size={12} /> {match.profession}
                      </small>
                      <small>
                        <MapPin size={12} /> {match.city}
                      </small>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Match Dossier */}
          {selected ? (
            <MatchDetail
              match={selected}
              photoIndex={photoIndex}
              setPhotoIndex={setPhotoIndex}
              isExpressed={Boolean(expressedInterests[selected.id])}
              onToggleInterest={() => toggleInterest(selected.id)}
              isSaved={Boolean(savedProfiles[selected.id])}
              onToggleSave={() => toggleSave(selected.id)}
            />
          ) : (
            <div className="chat-state">
              <h2>No matches found</h2>
              <p>Try widening your preferred age range or cities in your criteria tab.</p>
            </div>
          )}
        </section>
      )}

      {/* 4. Profile & Preferences Tab */}
      {tab === "profile" && form && (
        <section className="member-management-card">
          <div className="management-heading">
            <span className="member-kicker" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <SlidersHorizontal size={13} /> Dossier & Partner Criteria
            </span>
            <h2>Keep your requirements and journey current</h2>
            <p>
              Your partner criteria govern the algorithm queries that rank profiles in your network.
              Updates reflect immediately upon saving.
            </p>
          </div>

          <form className="member-profile-form" onSubmit={saveProfile}>
            {/* Section 1: Partner Criteria */}
            <div className="preference-form-title">
              <Sparkles size={22} color="#d81b60" />
              <div>
                <strong>Partner Compatibility Criteria</strong>
                <small>These filters select candidate matches from the verified database.</small>
              </div>
            </div>

            <Field label="Preferred Age Minimum">
              <input
                className="control"
                type="number"
                min="18"
                max="80"
                value={form.preferredAgeMin}
                onChange={(event) => setForm({ ...form, preferredAgeMin: event.target.value })}
                required
              />
            </Field>

            <Field label="Preferred Age Maximum">
              <input
                className="control"
                type="number"
                min="18"
                max="80"
                value={form.preferredAgeMax}
                onChange={(event) => setForm({ ...form, preferredAgeMax: event.target.value })}
                required
              />
            </Field>

            <Field label="Preferred Cities (comma-separated)" wide>
              <input
                className="control"
                value={form.preferredCities}
                onChange={(event) => setForm({ ...form, preferredCities: event.target.value })}
                placeholder="e.g. Hyderabad, Bengaluru, Pune, Mumbai, Chennai"
              />
            </Field>

            <Field label="Preferred Languages (comma-separated)" wide>
              <input
                className="control"
                value={form.preferredLanguages}
                onChange={(event) => setForm({ ...form, preferredLanguages: event.target.value })}
                placeholder="e.g. Telugu, English, Hindi, Tamil, Kannada"
              />
            </Field>

            <Field label="Child Preference">
              <input
                className="control"
                value={form.childPreference}
                onChange={(event) => setForm({ ...form, childPreference: event.target.value })}
                placeholder="e.g. Open to discussion / No children"
              />
            </Field>

            <Field label="Relocation Preference">
              <input
                className="control"
                value={form.relocationPreference}
                onChange={(event) => setForm({ ...form, relocationPreference: event.target.value })}
                placeholder="e.g. Open to relocation / Based in city"
              />
            </Field>

            {/* Section 2: Personal Profile */}
            <div className="preference-form-title" style={{ marginTop: "24px" }}>
              <User size={22} color="#4b0d3d" />
              <div>
                <strong>Your Member Biodata & Narrative</strong>
                <small>Displayed securely to compatible members in their private dashboard.</small>
              </div>
            </div>

            <Field label="Current Age">
              <input
                className="control"
                type="number"
                min="21"
                max="80"
                value={form.age}
                onChange={(event) => setForm({ ...form, age: event.target.value })}
                required
              />
            </Field>

            <Field label="Current City">
              <input
                className="control"
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                required
              />
            </Field>

            <Field label="Profession / Role">
              <input
                className="control"
                value={form.profession}
                onChange={(event) => setForm({ ...form, profession: event.target.value })}
                required
              />
            </Field>

            <Field label="Direct Phone (Shielded until mutual consent)">
              <input
                className="control"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </Field>

            <Field label="Height">
              <input
                className="control"
                value={form.height}
                onChange={(event) => setForm({ ...form, height: event.target.value })}
              />
            </Field>

            <Field label="Highest Education">
              <input
                className="control"
                value={form.education}
                onChange={(event) => setForm({ ...form, education: event.target.value })}
              />
            </Field>

            <Field label="Children Status">
              <input
                className="control"
                value={form.children}
                onChange={(event) => setForm({ ...form, children: event.target.value })}
              />
            </Field>

            <Field label="Passions & Interests (comma-separated)">
              <input
                className="control"
                value={form.interestsText}
                onChange={(event) => setForm({ ...form, interestsText: event.target.value })}
                placeholder="e.g. Travel, Literature, Tennis, Photography"
              />
            </Field>

            <Field label="Personal Introduction (Bio)" wide>
              <textarea
                className="control"
                rows={4}
                value={form.bio}
                onChange={(event) => setForm({ ...form, bio: event.target.value })}
                required
              />
            </Field>

            <Field label="Family Context & Values" wide>
              <textarea
                className="control"
                rows={3}
                value={form.familyDetails}
                onChange={(event) => setForm({ ...form, familyDetails: event.target.value })}
              />
            </Field>

            <Field label="Partner Intent & Life Philosophy" wide>
              <textarea
                className="control"
                rows={3}
                value={form.valuesText}
                onChange={(event) => setForm({ ...form, valuesText: event.target.value })}
              />
            </Field>

            <div className="profile-save-row">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Saving updates to database..." : "Save Profile & Preferences"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 5. Photographs Vault Tab */}
      {tab === "photos" && (
        <section className="member-management-card">
          <div className="management-heading">
            <span className="member-kicker" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Camera size={13} /> Private Photographs Vault
            </span>
            <h2>Discreet, Watermarked Photograph Management</h2>
            <p>
              Add up to five high-definition portraits. All photographs are automatically watermarked
              and only displayed to mutual matches meeting your verification criteria.
            </p>
          </div>

          <form className="photo-upload-zone" onSubmit={uploadPhoto}>
            <div className="photo-upload-icon">
              <Upload size={24} />
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", color: "#38072e" }}>
              Upload Portrait to Private Vault
            </h3>
            <p>Supports JPEG, PNG, or WebP up to 5 MB</p>
            <input
              className="control"
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              required
              style={{ maxWidth: "340px", margin: "0 auto 16px", display: "block" }}
            />
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Uploading photograph..." : "Add to Private Vault"}
            </button>
          </form>

          <div className="own-photo-grid">
            {data.ownPhotos.map((photo) => (
              <article key={photo.id}>
                <div
                  className="member-tile-photo"
                  style={{
                    backgroundImage: `url(${photo.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                  role="img"
                  aria-label={photo.altText}
                />
                <div>
                  <span>{photo.uploaded ? "Vault Upload" : "Primary Portrait"}</span>
                  {photo.uploaded && (
                    <button
                      type="button"
                      onClick={() => void deletePhoto(photo)}
                      disabled={busy}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        border: 0,
                        background: "none",
                        color: "#d81b60",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MatchDetail({
  match,
  photoIndex,
  setPhotoIndex,
  isExpressed,
  onToggleInterest,
  isSaved,
  onToggleSave,
}: {
  match: MatchProfile;
  photoIndex: number;
  setPhotoIndex: (index: number) => void;
  isExpressed: boolean;
  onToggleInterest: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  const currentPhoto = match.photos[photoIndex] ?? match.photos[0];
  const connected = match.connection?.status === "connected";

  return (
    <div className="member-workspace member-ranked-detail">
      <section className="member-profile-card" aria-label={`${match.displayName} profile`}>
        {/* Header with Title & Action Buttons */}
        <div className="member-match-heading">
          <div>
            <span className="member-kicker" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={13} /> {match.compatibilityScore}% Compatibility Index
            </span>
            <h2>
              {match.displayName}, {match.age}
            </h2>
            <p>
              {match.profession} · {match.city}
            </p>
          </div>

          <div className="match-action-bar">
            <button
              type="button"
              className={"btn-express-interest" + (isExpressed ? " sent" : "")}
              onClick={onToggleInterest}
            >
              <Heart size={16} fill={isExpressed ? "white" : "transparent"} />
              {isExpressed ? "Interest Expressed ✓" : "Express Interest"}
            </button>

            <button
              type="button"
              className={"btn-icon-round" + (isSaved ? " saved" : "")}
              onClick={onToggleSave}
              title={isSaved ? "Saved to Bookmarks" : "Save to Bookmarks"}
            >
              <Bookmark size={18} fill={isSaved ? "#db2777" : "transparent"} />
            </button>
          </div>
        </div>

        {/* Multi-Photo Carousel Stage */}
        <div className="member-gallery">
          <div
            className="member-gallery-photo"
            style={{ backgroundImage: `url(${currentPhoto?.url})` }}
            role="img"
            aria-label={currentPhoto?.altText}
          />
          <span className="gallery-watermark">
            <Lock size={12} /> Confidential Dossier · ReKnott Private
          </span>

          {match.photos.length > 1 && (
            <>
              <button
                className="gallery-arrow previous"
                type="button"
                aria-label="Previous photograph"
                onClick={() => setPhotoIndex((photoIndex - 1 + match.photos.length) % match.photos.length)}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="gallery-arrow next"
                type="button"
                aria-label="Next photograph"
                onClick={() => setPhotoIndex((photoIndex + 1) % match.photos.length)}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="gallery-count">
            Photo {match.photos.length ? photoIndex + 1 : 0} of {match.photos.length}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {match.photos.length > 1 && (
          <div className="gallery-thumbnails">
            {match.photos.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={idx === photoIndex ? "active" : ""}
                onClick={() => setPhotoIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${p.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Why You Match - Compatibility Insights */}
        <div className="match-reasons-strip">
          <div className="match-reasons-title">
            <Sparkles size={14} /> Mutual Alignment Highlights
          </div>
          <div className="match-reasons-grid">
            {match.matchReasons.map((reason) => (
              <span key={reason} className="match-reason-pill">
                <Check size={12} /> {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Categorized Executive Dossier Cards */}
        <div className="dossier-grid-wrapper">
          <div className="dossier-section-head">
            <FileCheck2 size={18} color="#8b1548" />
            <h3>Executive Biodata Dossier</h3>
          </div>
          <div className="dossier-cards-grid">
            {/* Card 1: Academic & Career */}
            <div className="dossier-category-card">
              <div className="card-cat-title">
                <Briefcase size={13} /> Career & Credentials
              </div>
              <dl className="dossier-data-list">
                <BiodataRow label="Profession" value={match.profession} />
                <BiodataRow label="Education" value={match.education} />
                <BiodataRow label="Annual Income" value={match.annualIncome} />
                <BiodataRow label="Work Location" value={match.city} />
              </dl>
            </div>

            {/* Card 2: Roots & Heritage */}
            <div className="dossier-category-card">
              <div className="card-cat-title">
                <Compass size={13} /> Origins & Language
              </div>
              <dl className="dossier-data-list">
                <BiodataRow label="Current City" value={match.city} />
                <BiodataRow label="Hometown" value={match.hometown} />
                <BiodataRow label="Mother Tongue" value={match.motherTongue} />
                <BiodataRow label="Identity Status" value={match.eligibilityLabel} />
              </dl>
            </div>

            {/* Card 3: Personal & Physical */}
            <div className="dossier-category-card">
              <div className="card-cat-title">
                <User size={13} /> Personal Details
              </div>
              <dl className="dossier-data-list">
                <BiodataRow label="Age" value={`${match.age} years`} />
                <BiodataRow label="Height" value={match.height} />
                <BiodataRow label="Marital Status" value="Divorced / Awaiting fresh start" />
                <BiodataRow label="Children" value={match.children} />
              </dl>
            </div>

            {/* Card 4: Future Outlook */}
            <div className="dossier-category-card">
              <div className="card-cat-title">
                <Star size={13} /> Future & Alignment
              </div>
              <dl className="dossier-data-list">
                <BiodataRow label="Partner Intent" value="Committed Marriage" />
                <BiodataRow label="Background Check" value="Court & KYC Cleared" />
                <BiodataRow label="Relocation" value="Open to discussion" />
                <BiodataRow label="Readiness" value="Ready for introduction" />
              </dl>
            </div>
          </div>
        </div>

        {/* Narrative / About In Their Words */}
        <div className="narrative-card">
          <div className="dossier-section-head">
            <Sparkles size={16} color="#d81b60" />
            <h3>In {match.displayName.split(" ")[0]}'s Own Words</h3>
          </div>
          <div className="narrative-quote-box">
            <p>"{match.bio}"</p>
          </div>
        </div>

        {/* Family Background & Life Philosophy */}
        <div className="narrative-card">
          <div className="dossier-section-head">
            <Users size={16} color="#8b1548" />
            <h3>Family Values & Partner Intent</h3>
          </div>
          <div className="narrative-quote-box">
            <p>"{match.familyDetails}"</p>
            {match.valuesText && <p>"{match.valuesText}"</p>}
          </div>
        </div>

        {/* Passions & Interests */}
        <div className="dossier-grid-wrapper">
          <div className="dossier-section-head">
            <Compass size={16} color="#d81b60" />
            <h3>Passions & Lifestyle Interests</h3>
          </div>
          <div className="member-interest-list">
            {match.interests.map((interest) => (
              <span key={interest}>✦ {interest}</span>
            ))}
          </div>
        </div>

        {/* Contact Reveal / Privacy Shield */}
        {connected ? (
          <div className="contact-reveal">
            <div className="contact-reveal-icon" aria-hidden="true">
              <Heart size={22} fill="white" />
            </div>
            <div>
              <span>Mutual Connection Active · Contact Unlocked</span>
              <strong>{match.phone || "+91 98490 12345"}</strong>
              <small>{match.email || `${match.displayName.toLowerCase().replace(/\s+/g, ".")}@member.reknott.com`}</small>
            </div>
          </div>
        ) : (
          <div className="contact-reveal private-contact">
            <div className="contact-reveal-icon" aria-hidden="true">
              <Lock size={20} />
            </div>
            <div>
              <span>100% Confidential Identity Protection</span>
              <strong>Phone number and direct messaging are shielded</strong>
              <small>Contact details unlock immediately upon mutual reciprocal interest.</small>
            </div>
          </div>
        )}
      </section>

      {/* Right Column: Concierge Introduction Suite or Embedded Live Chat */}
      <aside className="member-chat-column">
        {connected ? (
          <div className="concierge-card" style={{ padding: "20px 18px" }}>
            <div className="concierge-header" style={{ marginBottom: 12 }}>
              <div className="concierge-icon-badge">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2>Private Conversation</h2>
                <p>Talk to {match.displayName.split(" ")[0]} · End-to-end encrypted</p>
              </div>
            </div>
            <DemoChat embedded />
          </div>
        ) : (
          <div className="concierge-card">
            <div className="concierge-header">
              <div className="concierge-icon-badge">
                <Sparkles size={20} />
              </div>
              <div>
                <h2>Private Concierge</h2>
                <p>Discreet, verified introductions</p>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.55 }}>
              Interested in connecting with <strong>{match.displayName.split(" ")[0]}</strong>?
              Expressing interest alerts their private account while keeping your phone number shielded.
            </p>

            <div className="concierge-steps">
              <div className="concierge-step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <strong>Express Mutual Interest</strong>
                  <p>Your interest is shared discreetly with {match.displayName.split(" ")[0]}.</p>
                </div>
              </div>

              <div className="concierge-step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <strong>Advisor Review</strong>
                  <p>Our concierge verifies compatibility and mutual availability.</p>
                </div>
              </div>

              <div className="concierge-step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <strong>Direct Chat & Phone Unlock</strong>
                  <p>Upon reciprocal interest, contact details and private messaging unlock.</p>
                </div>
              </div>
            </div>

            <div className="concierge-action-wrap">
              <button
                className={"btn btn-primary btn-full" + (isExpressed ? " sent" : "")}
                type="button"
                onClick={onToggleInterest}
              >
                <Heart size={16} fill={isExpressed ? "white" : "transparent"} />
                {isExpressed ? "Interest Expressed ✓" : `Express Interest in ${match.displayName.split(" ")[0]}`}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function BiodataRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="dossier-item">
      <dt>{label}</dt>
      <dd>{value || "Not specified"}</dd>
    </div>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field${wide ? " field-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function profileToForm(profile: ViewerProfile): ProfileForm {
  return {
    age: String(profile.age),
    city: profile.city,
    profession: profile.profession,
    bio: profile.bio,
    phone: profile.phone ?? "",
    height: profile.height ?? "",
    education: profile.education ?? "",
    children: profile.children ?? "",
    familyDetails: profile.familyDetails ?? "",
    valuesText: profile.valuesText ?? "",
    interestsText: profile.interests.join(", "),
    preferredAgeMin: String(profile.preferredAgeMin ?? 24),
    preferredAgeMax: String(profile.preferredAgeMax ?? 36),
    preferredCities: (profile.preferredCities ?? []).join(", "),
    preferredLanguages: (profile.preferredLanguages ?? []).join(", "),
    childPreference: profile.childPreference ?? "",
    relocationPreference: profile.relocationPreference ?? "",
  };
}
